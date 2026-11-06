"""Corrige frames de animação do mascote gerados por IA e monta o WebP final.

O gerador devolve o Strawby com mottling — milhares de cores onde a arte
original tem ~14 — e, dependendo do pack, com a cor deslocada ou sem alpha.
Este script faz, em ordem:

  1. resolve o fundo: recorta (pack opaco) ou reconstrói o alpha (pack keyado)
  2. recolore via RBF, ancorado na paleta do SVG original (verde/olhos intactos)
  3. achata o mottling snapando interiores numa paleta k-means
  4. reamostra pra duração alvo e exporta WebP animado com alpha

Três estilos de pack, detectados sozinhos pelo alpha e pela cor do corpo no
primeiro frame — o fundo e a paleta variam de forma independente:

  `alpha`      — RGBA com silhueta certa, corpo puxado pro laranja (#C64F0A)
  `flat`       — RGB opaco sobre fundo quase branco, corpo já quase certo (#D01527)
  `alpha-flat` — corpo já quase certo, mas o alpha segue a luminância: olho,
                 semente e props claros chegam semitransparentes e somem no
                 dark mode. É o que o gerador devolveu nos packs de 06/11

Uso:
    python scripts/mascot-frames.py <frames.zip|pasta> [-o saida.webp]
                                    [--style auto|alpha|flat|alpha-flat]
                                    [--seconds 3] [--fps 24] [--size 640]
                                    [--quality 95] [--lossless] [--keep-frames]

Requer: pillow, numpy (+ scipy, pros packs `flat` e `alpha-flat`).
"""

import argparse
import os
import shutil
import sys
import tempfile
import zipfile

import numpy as np
from PIL import Image

# --- 1. recolor: (cor nos frames gerados) -> (cor da arte original) ----------
# Fonte da verdade: client/public/mascot/strawby-mascote.svg
RECOLOR_ANCHORS = [
    ((216, 86, 9), (243, 16, 42)),       # corpo        -> #F3102A
    ((213, 85, 9), (240, 15, 41)),       # corpo alt
    ((197, 109, 0), (207, 3, 32)),       # sombra       -> #CF0320
    ((163, 87, 8), (176, 2, 27)),        # sombra funda
    ((233, 159, 105), (252, 137, 122)),  # sementes     -> #FC897A
    ((45, 21, 14), (53, 4, 22)),         # escuro quente-> #350416
    # âncoras identidade: não podem se mover
    ((24, 152, 64), (24, 152, 64)),      # folha  #189840
    ((88, 184, 64), (88, 184, 64)),      # folha  #58B840
    ((10, 116, 48), (10, 116, 48)),      # folha  #0A7430
    ((251, 247, 245), (251, 247, 245)),  # esclera #FBF7F5
    ((255, 255, 255), (255, 255, 255)),
    ((53, 4, 22), (53, 4, 22)),          # pupila #350416
    ((36, 0, 16), (36, 0, 16)),
    ((0, 0, 0), (0, 0, 0)),
]

# --- 1b. mesma ideia pros packs `flat` -------------------------------------
# A fonte aqui é bem mais apertada (os vermelhos moram todos num raio de ~35),
# por isso o sigma menor: com 55 o corpo e a sombra viram a mesma cor.
FLAT_ANCHORS = [
    ((208, 21, 39), (243, 16, 42)),      # corpo        -> #F3102A
    ((204, 20, 36), (240, 15, 41)),      # corpo alt
    ((195, 14, 35), (207, 3, 32)),       # sombra       -> #CF0320
    ((172, 10, 31), (176, 2, 27)),       # sombra funda -> #B0021B
    ((231, 132, 126), (252, 137, 122)),  # sementes     -> #FC897A
    ((45, 7, 19), (53, 4, 22)),          # escuro       -> #350416
    ((23, 126, 61), (24, 152, 64)),      # folha        -> #189840
    ((88, 163, 70), (88, 184, 64)),      # folha clara  -> #58B840
    ((23, 121, 57), (10, 116, 48)),      # folha funda  -> #0A7430
    ((241, 234, 233), (251, 247, 245)),  # esclera      -> #FBF7F5
    ((255, 255, 255), (255, 255, 255)),
    ((41, 7, 17), (36, 0, 16)),          # pupila
    ((0, 0, 0), (0, 0, 0)),
]

# (âncoras, sigma, tratamento do fundo) — fundo e paleta variam separados: o
# pack pode chegar já transparente e mesmo assim precisar das âncoras `flat`
#
#   keep  — alpha do gerador já é a silhueta, não mexe
#   cut   — pack opaco, o fundo sai por inundação a partir da borda
#   unkey — alpha segue a luminância e comeu as áreas claras
# --- 1c. pros packs `alpha-flat`, medidas depois da mistura do `unkey_light` --
BLEND_ANCHORS = [
    ((211, 18, 37), (243, 16, 42)),      # corpo        -> #F3102A
    ((201, 20, 37), (243, 16, 42)),      # corpo alt
    ((215, 22, 41), (243, 16, 42)),      # corpo claro
    ((221, 19, 39), (243, 16, 42)),      # corpo claro alt
    ((191, 14, 33), (207, 3, 32)),       # sombra       -> #CF0320
    ((194, 34, 47), (207, 3, 32)),       # sombra dessaturada
    ((154, 6, 24), (176, 2, 27)),        # sombra funda -> #B0021B
    ((233, 128, 120), (252, 137, 122)),  # sementes     -> #FC897A
    ((44, 9, 18), (53, 4, 22)),          # pupila       -> #350416
    ((26, 127, 59), (24, 152, 64)),      # folha        -> #189840
    ((87, 167, 66), (88, 184, 64)),      # folha clara  -> #58B840
    ((249, 248, 248), (251, 247, 245)),  # esclera e props brancos
    # âncoras identidade: o cinza do celular e da prancheta não pode virar cor
    # do mascote, e o traço precisa continuar preto
    ((107, 115, 115), (107, 115, 115)),
    ((255, 255, 255), (255, 255, 255)),
    ((0, 0, 0), (0, 0, 0)),
]

STYLES = {
    "alpha": (RECOLOR_ANCHORS, 55.0, "keep"),
    "flat": (FLAT_ANCHORS, 28.0, "cut"),
    "alpha-flat": (BLEND_ANCHORS, 22.0, "unkey"),
}

PALETTE_K = 14     # cores da arte flat
SNAP_HARD = 16.0   # distância abaixo da qual o pixel é snapado inteiro
SNAP_SOFT = 40.0   # distância acima da qual o pixel fica intocado
CHUNK = 200_000

# --- silhueta: separar a arte do fundo do gerador --------------------------
BG_TOL = 26.0      # distância até a cor do fundo que ainda conta como fundo
KEYED_TOL = 8      # alpha abaixo disso é candidato a fundo nos packs keyados
TRUST_LO = 64.0    # abaixo disso o RGB do pack keyado é lixo: vale o composto
TRUST_HI = 192.0   # acima disso o RGB é confiável e a composição só lavaria
CORE = 2           # px descascados da silhueta pra achar a cor pura da arte
CORE_SOFT = 5      # ... e mais, quando o antialias do pack é largo (`unkey`)


def flood_outside(mask: np.ndarray) -> np.ndarray:
    """Do que parece fundo, só o que está ligado à borda do quadro é fundo.

    Limiar global comeria o olho: a esclera (#F1EAE9) fica a ~11 do fundo
    (#F1F2F4), e nos packs keyados ela também chega em alpha 0. Saindo da borda,
    o branco do olho está cercado pelo contorno escuro e nunca é alcançado.
    """
    from scipy import ndimage

    labels, _ = ndimage.label(mask)
    touching = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    return np.isin(labels, touching[touching > 0])


def art_core(outside: np.ndarray, depth: int = CORE) -> np.ndarray:
    """A silhueta descascada em `depth` px: cor de arte pura, sem mistura."""
    from scipy import ndimage

    core = ndimage.binary_erosion(~outside, iterations=depth)
    return core if core.any() else ~outside


def nearest_art(rgb: np.ndarray, core: np.ndarray) -> np.ndarray:
    """Cor do pixel do miolo mais próximo, pra cada pixel do quadro."""
    from scipy import ndimage

    _, (rows, cols) = ndimage.distance_transform_edt(~core, return_indices=True)
    return rgb[rows, cols]


def build(
    rgb: np.ndarray, alpha: np.ndarray, outside: np.ndarray, depth: int = CORE
) -> np.ndarray:
    """Fecha o RGBA: miolo opaco, borda com a cor da arte vizinha, fundo zerado.

    Fora do miolo a cor passa a ser a do pixel de arte mais próximo. O alpha já
    responde pela transparência, e guardar ali a cor misturada com o fundo
    deixaria um aro claro em volta do mascote inteiro no dark mode.

    `depth` precisa cobrir o antialias do pack inteiro: o que sobra de banda
    dentro do miolo continua carregando a mistura e vira esse mesmo aro, só que
    mais fino.
    """
    core = art_core(outside, depth)
    art = nearest_art(rgb, core)

    solid = np.where(core, 255.0, alpha)
    solid[outside] = 0.0

    return np.concatenate([np.where(core[..., None], rgb, art), solid[..., None]], axis=2)


def cut_background(rgb: np.ndarray) -> np.ndarray:
    """Transforma RGB opaco em RGBA, tirando só o fundo ligado à borda.

    Na borda o pixel é uma mistura de fundo e arte, e a cobertura real sai da
    projeção dele na reta fundo->arte: `p = a*arte + (1-a)*fundo`.

    Rampa por distância até o fundo não serve: ela satura a poucos px e deixa a
    borda opaca com a cor meio misturada, que vira aro claro no dark mode.
    """
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    bg = np.median(border, axis=0)
    outside = flood_outside(np.linalg.norm(rgb - bg, axis=2) < BG_TOL)

    delta = nearest_art(rgb, art_core(outside)) - bg
    coverage = ((rgb - bg) * delta).sum(2) / np.maximum((delta * delta).sum(2), 1e-6)

    return build(rgb, np.clip(coverage, 0.0, 1.0) * 255.0, outside)


def unkey_light(rgba: np.ndarray) -> np.ndarray:
    """Desfaz o key de área clara e devolve o alpha de silhueta.

    Nestes packs o alpha segue a luminância e afunda nas áreas claras: pupila,
    esclera e props brancos chegam quase transparentes — e o RGB debaixo deles
    é lixo de compressão, porque o codificador não gasta bit onde alpha é zero.
    Por isso a cor crua não serve: ela traz o lixo junto, e a pupila aparece
    como um anel listrado em volta do olho.

    O que o gerador quis mostrar é o frame composto sobre branco, e compor
    resolve o lixo — ele some junto com o alpha que o escondia. Só que compor
    injeta branco proporcional a `1 - a`, e isso lava tudo que tem alpha médio:
    a folha chega em ~197 e sai clara, com um degradê que o k-means depois
    posteriza em manchas.

    Então a composição vale só onde ela é necessária. Acima de `TRUST_HI` o RGB
    do pack é confiável e fica como está; abaixo de `TRUST_LO` ele é lixo e vale
    o composto; no meio, mistura. É a diferença entre a pupila preta e a pupila
    cinza, e entre a folha chapada e a folha manchada.

    O alpha vira 255 no miolo (a transparência era artefato do key) e continua
    valendo na borda da silhueta, que lá é cobertura de verdade.
    """
    alpha = rgba[..., 3]
    rgb = rgba[..., :3]

    coverage = alpha[..., None] / 255.0
    over_white = rgb * coverage + 255.0 * (1.0 - coverage)

    trust = np.clip((alpha - TRUST_LO) / (TRUST_HI - TRUST_LO), 0.0, 1.0)[..., None]
    blended = trust * rgb + (1.0 - trust) * over_white

    return build(blended, alpha, flood_outside(alpha < KEYED_TOL), CORE_SOFT)


def recolor(rgb: np.ndarray, src: np.ndarray, delta: np.ndarray, sigma: float) -> np.ndarray:
    """Deforma o espaço de cor via RBF gaussiano sobre as âncoras."""
    d2 = ((rgb[:, None, :] - src[None]) ** 2).sum(2)
    w = np.exp(-d2 / (2 * sigma**2))
    w /= np.maximum(w.sum(1, keepdims=True), 1e-9)
    return rgb + w @ delta


def build_palette(frames: list[np.ndarray]) -> np.ndarray:
    """k-means nos pixels opacos de uma amostra de frames."""
    rng = np.random.default_rng(0)
    sample = np.concatenate([f[f[..., 3] > 240][:, :3].astype(np.float32) for f in frames])
    if len(sample) > 300_000:
        sample = sample[rng.choice(len(sample), 300_000, replace=False)]

    C = sample[rng.choice(len(sample), PALETTE_K, replace=False)]
    for _ in range(30):
        lab = ((sample[:, None, :] - C[None]) ** 2).sum(2).argmin(1)
        for i in range(PALETTE_K):
            if (lab == i).any():
                C[i] = sample[lab == i].mean(0)
    return C


def flatten(rgb: np.ndarray, C: np.ndarray) -> np.ndarray:
    """Snapa interiores na paleta; deixa bordas e antialias em paz."""
    d2 = ((rgb[:, None, :] - C[None]) ** 2).sum(2)
    j = d2.argmin(1)
    dist = np.sqrt(d2[np.arange(len(rgb)), j])
    t = np.clip((SNAP_SOFT - dist) / (SNAP_SOFT - SNAP_HARD), 0, 1)[:, None]
    return rgb * (1 - t) + C[j] * t


def process(a: np.ndarray, C: np.ndarray | None, style: str) -> np.ndarray:
    """Aplica recolor (+ flatten, se já houver paleta) num frame RGBA."""
    anchors, sigma, _ = STYLES[style]
    src = np.array([s for s, _ in anchors], dtype=np.float32)
    delta = np.array([np.subtract(d, s) for s, d in anchors], dtype=np.float32)

    h, w = a.shape[:2]
    rgb = a[..., :3].reshape(-1, 3).astype(np.float32)
    out = np.empty_like(rgb)
    for s in range(0, len(rgb), CHUNK):
        chunk = recolor(rgb[s : s + CHUNK], src, delta, sigma)
        if C is not None:
            chunk = flatten(chunk, C)
        out[s : s + CHUNK] = chunk
    a = a.copy()
    a[..., :3] = np.clip(out, 0, 255).round().astype(np.uint8).reshape(h, w, 3)
    return a


def read_frame(path: str, style: str) -> np.ndarray:
    """Abre o PNG como RGBA, resolvendo o fundo conforme o estilo do pack."""
    im = Image.open(path)
    background = STYLES[style][2]

    if background == "keep":
        return np.array(im.convert("RGBA"))

    if background == "cut":
        rgba = cut_background(np.array(im.convert("RGB"), dtype=np.float32))
    else:
        rgba = unkey_light(np.array(im.convert("RGBA"), dtype=np.float32))

    return np.clip(rgba, 0, 255).round().astype(np.uint8)


def body_color(rgba: np.ndarray) -> np.ndarray | None:
    """Mediana dos pixels do corpo — vermelhos/alaranjados opacos e saturados.

    A mediana descarta folhas e olhos sozinha: eles são minoria entre os pixels
    em que o vermelho é o canal dominante.
    """
    opaque = rgba[rgba[..., 3] > 240][:, :3].astype(np.float32)
    body = opaque[(opaque[:, 0] > 120) & (opaque[:, 0] == opaque.max(1))]
    return np.median(body, axis=0) if len(body) else None


def detect_style(path: str) -> str:
    """Decide fundo e paleta separados: alpha pronto? corpo já vermelho?

    O gerador mudou duas vezes e cada mudança mexeu num eixo só — por isso a
    cor do corpo é medida mesmo quando o pack já chega com alpha.
    """
    im = Image.open(path)
    rgba = np.array(im.convert("RGBA"))

    if im.mode not in ("RGBA", "LA") or rgba[..., 3].min() == 255:
        return "flat"

    body = body_color(rgba)
    if body is None:
        return "alpha"

    orange = np.array(RECOLOR_ANCHORS[0][0], np.float32)
    red = np.array(FLAT_ANCHORS[0][0], np.float32)
    return "alpha" if np.linalg.norm(body - orange) < np.linalg.norm(body - red) else "alpha-flat"


def load_frames(source: str, workdir: str) -> list[str]:
    if os.path.isfile(source) and source.lower().endswith(".zip"):
        extracted = os.path.join(workdir, "in")
        with zipfile.ZipFile(source) as z:
            z.extractall(extracted)
        source = extracted

    pngs = []
    for root, _, files in os.walk(source):
        if "__MACOSX" in root:  # zip do macOS traz um sidecar por frame
            continue
        pngs += [
            os.path.join(root, f)
            for f in files
            if f.lower().endswith(".png") and not f.startswith("._")
        ]
    if not pngs:
        sys.exit(f"nenhum PNG encontrado em {source}")
    return sorted(pngs)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("source", help="frames.zip ou pasta com os PNGs")
    p.add_argument("-o", "--output", default="mascot-animation.webp")
    p.add_argument(
        "--style",
        choices=["auto", *STYLES],
        default="auto",
        help="tipo do pack: `alpha` (RGBA laranja) ou `flat` (RGB opaco) — padrão: detecta",
    )
    p.add_argument("--seconds", type=float, default=3.0)
    p.add_argument("--fps", type=int, default=24)
    p.add_argument("--skip-start", type=int, default=0, help="descarta N frames do início")
    p.add_argument("--skip-end", type=int, default=0, help="descarta N frames do fim")
    p.add_argument(
        "--boomerang",
        action="store_true",
        help="toca a animação e volta de ré — loop costurado sem salto",
    )
    p.add_argument("--size", type=int, default=640)
    p.add_argument("--quality", type=int, default=95)
    p.add_argument("--lossless", action="store_true")
    p.add_argument("--keep-frames", metavar="DIR", help="também salva os PNGs corrigidos")
    args = p.parse_args()

    workdir = tempfile.mkdtemp(prefix="mascot-")
    try:
        paths = load_frames(args.source, workdir)

        total = len(paths)
        paths = paths[args.skip_start : len(paths) - args.skip_end or None]
        if not paths:
            sys.exit("skip-start/skip-end descartaram todos os frames")
        if total != len(paths):
            print(f"descartados {total - len(paths)} frames (início {args.skip_start}, fim {args.skip_end})")

        style = args.style if args.style != "auto" else detect_style(paths[0])
        print(f"estilo do pack: {style}")

        total = max(1, round(args.seconds * args.fps))
        # na ida e volta só a metade precisa ser gerada — o resto é a mesma
        # sequência de ré, o que fecha o ciclo sem salto nenhum
        target = total // 2 + 1 if args.boomerang else total
        idx = np.linspace(0, len(paths), target, endpoint=False).astype(int)
        print(f"{len(paths)} frames -> {target} ({args.seconds}s @ {args.fps}fps)")

        selected = [read_frame(paths[i], style) for i in idx]

        # paleta vem dos frames já recoloridos, senão ela aprende a cor errada
        print("montando paleta...")
        C = build_palette(
            [process(f, None, style) for f in selected[:: max(1, len(selected) // 8)]]
        )
        print("paleta:", ", ".join("#%02X%02X%02X" % tuple(c.round().astype(int)) for c in C))

        out_frames = []
        for i, f in enumerate(selected):
            im = Image.fromarray(process(f, C, style), "RGBA")
            if im.size != (args.size, args.size):
                im = im.resize((args.size, args.size), Image.LANCZOS)
            out_frames.append(im)
            if args.keep_frames:
                os.makedirs(args.keep_frames, exist_ok=True)
                im.save(os.path.join(args.keep_frames, f"frame_{i:04d}.png"))
            if (i + 1) % 20 == 0 or i + 1 == len(selected):
                print(f"  {i + 1}/{len(selected)}")

        if args.boomerang:
            # [1:-1] invertido: não repete os extremos, senão eles ficam 2 frames
            out_frames += out_frames[-2:0:-1]
            print(f"boomerang: {len(out_frames)} frames no ciclo")

        print("encodando webp...")
        enc = {"lossless": True, "method": 4} if args.lossless else {"quality": args.quality, "method": 6}
        out_frames[0].save(
            args.output,
            save_all=True,
            append_images=out_frames[1:],
            duration=round(1000 / args.fps),
            loop=0,
            **enc,
        )
        print(f"{args.output} — {os.path.getsize(args.output) // 1024} KB")
    finally:
        shutil.rmtree(workdir, ignore_errors=True)


if __name__ == "__main__":
    main()
