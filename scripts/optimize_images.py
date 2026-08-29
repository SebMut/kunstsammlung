from __future__ import annotations

import argparse
import os
from pathlib import Path

from PIL import Image, ImageOps


def optimize_image(source: Path, quality: int) -> tuple[int, int]:
    original_size = source.stat().st_size
    temporary = source.with_suffix(source.suffix + ".optimized")

    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        if image.mode not in ("RGB", "L"):
            image = image.convert("RGB")
        image.save(
            temporary,
            format="JPEG",
            quality=quality,
            optimize=True,
            progressive=True,
        )

    optimized_size = temporary.stat().st_size
    if optimized_size < original_size:
        os.replace(temporary, source)
        return original_size, optimized_size

    temporary.unlink()
    return original_size, original_size


def main() -> None:
    parser = argparse.ArgumentParser(description="Optimize catalog JPEG files in place.")
    parser.add_argument("directory", type=Path)
    parser.add_argument("--quality", type=int, default=82)
    args = parser.parse_args()

    files = sorted(
        file
        for file in args.directory.rglob("*")
        if file.is_file() and file.suffix.lower() in {".jpg", ".jpeg"}
    )
    before = 0
    after = 0

    for index, file in enumerate(files, 1):
        old_size, new_size = optimize_image(file, args.quality)
        before += old_size
        after += new_size
        if index % 25 == 0 or index == len(files):
            print(f"Optimized {index} / {len(files)}")

    saved = before - after
    print(f"Saved {saved / 1024 / 1024:.1f} MiB ({before / 1024 / 1024:.1f} -> {after / 1024 / 1024:.1f} MiB)")


if __name__ == "__main__":
    main()
