from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = root / 'Mumu_Ice_Concept_Assets'
output = root / 'public' / 'images'
output.mkdir(parents=True, exist_ok=True)

assets = {
    'hero-desktop': ('heroes/mumu-hero-desktop.png', [960, 1440]),
    'hero-mobile': ('heroes/mumu-hero-mobile.png', [480, 720]),
    'ice-bag': ('products/mumu-ice-bag-concept.png', [550, 850]),
    'party': ('lifestyle/mumu-party-ice-bucket.png', [760, 1200]),
    'drink': ('lifestyle/mumu-lime-drink.png', [760, 1200]),
    'bulk': ('products/mumu-bulk-bags-concept.png', [760, 1200]),
    'floating-ice': ('cutouts/mumu-floating-ice.png', [560, 900]),
}

for name, (relative, widths) in assets.items():
    with Image.open(source / relative) as original:
        for width in widths:
            height = round(original.height * width / original.width)
            resized = original.resize((width, height), Image.Resampling.LANCZOS)
            target = output / f'{name}-{width}.webp'
            resized.save(target, 'WEBP', quality=87, method=6)
            print(f'{target.relative_to(root)}: {width}x{height}, {target.stat().st_size // 1024} KB')
