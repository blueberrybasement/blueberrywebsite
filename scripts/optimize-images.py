"""Regenerate responsive WebP assets from the checked-in artwork (Pillow required).
Run from the repository root: python scripts/optimize-images.py
Original files remain available for social previews and full-resolution screenshot zoom.
"""
from pathlib import Path
from PIL import Image, ImageOps

ASSETS = {
    'assets/game/feature-2026.jpg': ([640, 1024], 86),
    'assets/game/vertical-feature-2026.jpg': ([480, 760, 941], 86),
    'assets/game/meeting-mayhem-logo-2026.png': ([164, 328, 492], 90),
    'assets/minit/collection.jpg': ([600, 1200], 86),
    **{f'assets/game/screenshots/{name}.png': ([480, 960, 1672], 90)
       for name in ['sort-the-schedule', 'resolve-all-overlaps', 'daily-tasks', 'daily-spinner']},
}

if __name__ == '__main__':
    with Image.open('assets/game/meeting-mayhem-logo-2026.png') as icon:
        icon.resize((64, 64), Image.Resampling.LANCZOS).save('assets/game/favicon.png', optimize=True)
    for source, (widths, quality) in ASSETS.items():
        path = Path(source)
        with Image.open(path) as original:
            image = ImageOps.exif_transpose(original).convert('RGBA' if 'A' in original.getbands() else 'RGB')
            for width in widths:
                height = round(image.height * width / image.width)
                output = path.with_name(f'{path.stem}-{width}.webp')
                image.resize((width, height), Image.Resampling.LANCZOS).save(
                    output, 'WEBP', quality=quality, method=6)
                print(f'{output}: {width}x{height}, {output.stat().st_size:,} bytes')
