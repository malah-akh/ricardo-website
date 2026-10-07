"""Regenerate small display assets and the social banner from original artwork."""
from pathlib import Path
import re
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
brand = ROOT / 'assets/brand'
logos = ROOT / 'assets/logos'
scylla = logos / 'scylladb.svg'
svg = scylla.read_text()
svg = re.sub(r'<i:pgf\b[\s\S]*?</i:pgf>', '', svg)
svg = re.sub(r'<i:aipgf\b[\s\S]*?</i:aipgf>', '', svg)
scylla.write_text("\n".join(line.rstrip() for line in svg.splitlines()) + "\n")
rb = Image.open(brand / 'rb-green-original.png').convert('RGBA').crop((244, 244, 1012, 1012))
rb.resize((132, 132), Image.Resampling.LANCZOS).save(brand / 'rb-green.webp', lossless=True)
for name in ['chess-com', 'datanised', 'tsmc', 'zoox']:
    img = Image.open(logos / f'{name}.png').convert('RGBA')
    img.thumbnail((450, 168), Image.Resampling.LANCZOS)
    img.save(logos / f'{name}.webp', lossless=True)
canvas = Image.new('RGB', (1200, 630), '#163d35')
draw = ImageDraw.Draw(canvas)
font_dir = Path('/System/Library/Fonts/Supplemental')
def font(size, bold=False):
    return ImageFont.truetype(str(font_dir / ('Arial Bold.ttf' if bold else 'Arial.ttf')), size)
mark = rb.resize((132, 132), Image.Resampling.LANCZOS)
canvas.paste(mark, (80, 65), mark)
draw.text((240, 103), 'Ricardo Borenstein', font=font(36, True), fill='#f4f5ed')
draw.text((80, 255), 'Make the next', font=font(64, True), fill='#f4f5ed')
draw.text((80, 330), 'technical decision count.', font=font(64, True), fill='#d9ed92')
draw.line((80, 455, 1120, 455), fill='#627d59', width=2)
draw.text((80, 494), 'Applied AI · Systems architecture', font=font(30), fill='#f4f5ed')
draw.text((80, 540), 'Solutions engineering', font=font(30), fill='#f4f5ed')
canvas.save(brand / 'social-preview.jpg', quality=90, optimize=True)
