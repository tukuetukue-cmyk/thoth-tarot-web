from PIL import Image, ImageDraw
import sys

def crop_to_circle(image_path):
    # 画像を開く
    img = Image.open(image_path).convert("RGBA")
    
    # 画像と同じサイズの透明画像の作成
    mask = Image.new('L', img.size, 0)
    draw = ImageDraw.Draw(mask)
    
    # 円を描画 (少し内側でアンチエイリアスが効くように)
    draw.ellipse((0, 0, img.size[0], img.size[1]), fill=255)
    
    # 元画像にマスクを適用
    img.putalpha(mask)
    
    # 上書き保存
    img.save(image_path, "PNG")
    print(f"Success: {image_path} is now circular with a transparent background.")

if __name__ == "__main__":
    crop_to_circle("public/favicon.png")
