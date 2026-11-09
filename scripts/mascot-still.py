"""Gera o still `<ação>-end.webp` a partir de um frame da animação.

O still é o frame em que o `StrawbyMascot` congela quando o playback é `once`.
Algumas animações voltam pra pose neutra no fim (o rabo que fecha o loop sem
pulo), então congelar no último frame mostra o mascote parado em vez da pose.
Nesses casos escolhe-se um frame do meio — e o `MASCOT_ACTION_DURATION_MS`
daquela ação passa a apontar pro mesmo instante.

A animação NÃO é tocada: cortá-la arrumaria o congelamento e quebraria o loop
em todo lugar que a usa em `loop` (assistente, por exemplo).

Uso:
    python scripts/mascot-still.py client/public/mascot/actions/thinking.webp --frame 36
"""

import argparse
import os

from PIL import Image


def build_still(path: str, frame: int) -> None:
    source = Image.open(path)
    index = frame if frame >= 0 else source.n_frames + frame

    if not 0 <= index < source.n_frames:
        raise SystemExit(f"frame {frame} fora de 0..{source.n_frames - 1}")

    source.seek(index)
    still = source.convert("RGBA")

    base, _ = os.path.splitext(path)
    target = f"{base}-end.webp"
    still.save(target, lossless=True, quality=100, method=6)

    print(f"{os.path.basename(target)}: frame {index} de {source.n_frames}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", help="WebP animado de origem")
    parser.add_argument("--frame", type=int, default=-1, help="índice do frame (negativo conta do fim)")
    args = parser.parse_args()

    build_still(args.path, args.frame)


if __name__ == "__main__":
    main()
