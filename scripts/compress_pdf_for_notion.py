from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


PAGE_WIDTH = 595.28
PAGE_HEIGHT = 841.89


def render_pages(input_pdf: Path, work_dir: Path, dpi: int) -> list[Path]:
    prefix = work_dir / f"page_{dpi}"
    subprocess.run(
        [
            "/Users/lisiahsumbp2024/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/pdftoppm",
            "-jpeg",
            "-r",
            str(dpi),
            str(input_pdf),
            str(prefix),
        ],
        check=True,
    )
    return sorted(work_dir.glob(f"page_{dpi}-*.jpg"))


def make_pdf(images: list[Path], output_pdf: Path, quality: int) -> None:
    c = canvas.Canvas(str(output_pdf), pagesize=(PAGE_WIDTH, PAGE_HEIGHT), pageCompression=1)
    temp_images: list[Path] = []
    try:
        for idx, image_path in enumerate(images, start=1):
            optimized = output_pdf.parent / f".notion_page_{idx:02d}.jpg"
            with Image.open(image_path) as img:
                rgb = img.convert("RGB")
                rgb.save(optimized, "JPEG", quality=quality, optimize=True, progressive=True)
            temp_images.append(optimized)
            c.drawImage(ImageReader(str(optimized)), 0, 0, width=PAGE_WIDTH, height=PAGE_HEIGHT)
            c.showPage()
        c.save()
    finally:
        for temp_image in temp_images:
            temp_image.unlink(missing_ok=True)


def main() -> int:
    input_pdf = Path(sys.argv[1])
    output_pdf = Path(sys.argv[2])
    work_dir = Path("tmp/pdfs/notion_compress")
    if work_dir.exists():
        shutil.rmtree(work_dir)
    work_dir.mkdir(parents=True)
    output_pdf.parent.mkdir(parents=True, exist_ok=True)

    for dpi, quality in [(110, 68), (100, 65), (90, 62)]:
        images = render_pages(input_pdf, work_dir, dpi)
        make_pdf(images, output_pdf, quality)
        size = output_pdf.stat().st_size
        print(f"{dpi}dpi quality={quality}: {size} bytes")
        if size < 5 * 1024 * 1024:
            return 0
        for image in images:
            image.unlink(missing_ok=True)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
