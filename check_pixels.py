from PIL import Image
import sys

def check(file):
    try:
        img = Image.open(file)
        w, h = img.size
        print(f"File {file} size: {w}x{h}")
        
        # Check top edge pixels
        top_colors = [img.getpixel((x, 10)) for x in range(0, w, 50)]
        print(f"Top edge pixels: {top_colors}")
        
    except Exception as e:
        print(f"Error on {file}: {e}")

check('public/assets/images/cards/fool_rm.jpg')
check('public/assets/images/cards/cups_8_rm.jpg')
check('public/assets/images/cards/disks_2_rm.jpg')
