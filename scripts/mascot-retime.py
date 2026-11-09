"""Desacelera (ou acelera) um WebP animado do mascote sem recodificar a arte.

Reescreve só o campo de duração de cada frame dentro do container RIFF — os
bytes da imagem continuam exatamente os mesmos. Recodificar com Pillow custaria
uma geração a mais de perda (ou 2.6x de tamanho em lossless) só pra mudar o
ritmo, que já está montado por `mascot-frames.py`.

Uso:
    python scripts/mascot-retime.py client/public/mascot/actions/idle.webp --factor 1.25
    python scripts/mascot-retime.py idle.webp --total 3800

Lembre de atualizar `MASCOT_ACTION_DURATION_MS` em
`client/src/shared/config/mascotActions.ts` com a duração nova.
"""

import argparse
import os
import struct

# layout do payload ANMF: x(3) y(3) w(3) h(3) duration(3) flags(1)
DURATION_OFFSET = 12
DURATION_BYTES = 3
MAX_DURATION = 2**24 - 1


def read_u24(data: bytes, offset: int) -> int:
    return int.from_bytes(data[offset : offset + DURATION_BYTES], "little")


def write_u24(data: bytearray, offset: int, value: int) -> None:
    data[offset : offset + DURATION_BYTES] = min(max(value, 1), MAX_DURATION).to_bytes(
        DURATION_BYTES, "little"
    )


def frame_offsets(data: bytes) -> list[int]:
    """Posição do campo de duração de cada chunk ANMF."""
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise ValueError("não é um arquivo WebP")

    offsets = []
    cursor = 12

    while cursor + 8 <= len(data):
        fourcc = data[cursor : cursor + 4]
        (size,) = struct.unpack("<I", data[cursor + 4 : cursor + 8])
        payload = cursor + 8

        if fourcc == b"ANMF":
            offsets.append(payload + DURATION_OFFSET)

        # chunks têm padding pra tamanho par
        cursor = payload + size + (size % 2)

    return offsets


def retime(path: str, factor: float | None, total: int | None) -> None:
    with open(path, "rb") as file:
        data = bytearray(file.read())

    offsets = frame_offsets(data)
    if not offsets:
        print(f"{os.path.basename(path)}: estático, ignorado")
        return

    durations = [read_u24(data, offset) for offset in offsets]
    old_total = sum(durations)
    scale = (total / old_total) if total else (factor or 1.0)

    # arredonda frame a frame pra não acumular erro ao longo do loop
    new_durations = [max(round(duration * scale), 1) for duration in durations]
    for offset, duration in zip(offsets, new_durations):
        write_u24(data, offset, duration)

    with open(path, "wb") as file:
        file.write(data)

    print(
        f"{os.path.basename(path)}: {old_total}ms -> {sum(new_durations)}ms "
        f"({len(offsets)} frames, {new_durations[0]}ms cada)"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", help="WebP animados a reescrever (in-place)")
    parser.add_argument(
        "--factor", type=float, help="multiplicador da duração (1.25 = 25%% mais lento)"
    )
    parser.add_argument("--total", type=int, help="duração alvo do loop inteiro, em ms")
    args = parser.parse_args()

    if not args.factor and not args.total:
        parser.error("informe --factor ou --total")

    for path in args.paths:
        retime(path, args.factor, args.total)


if __name__ == "__main__":
    main()
