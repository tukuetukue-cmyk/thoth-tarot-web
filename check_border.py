from PIL import Image
import os

files = ['public/assets/images/cards/disks_princess.jpg', 
         'public/assets/images/cards/cups_8.jpg', 
         'public/assets/images/cards/wands_3.jpg',
         'public/assets/images/cards/disks_2.jpg']

for f in files:
    try:
        img = Image.open(f)
        top_left_pixel = img.getpixel((0, 0))
        top_middle_pixel = img.getpixel((img.width // 2, 0))
        bottom_right_pixel = img.getpixel((img.width - 1, img.height - 1))
        
        # Look 10 pixels in
        in_10 = img.getpixel((10, 10))
        
        print(f"{os.path.basename(f)}: (0,0)={top_left_pixel}, (mid,0)={top_middle_pixel}, BotRight={bottom_right_pixel}, (10,10)={in_10}")
    except Exception as e:
        print(f"Error on {f}: {e}")

