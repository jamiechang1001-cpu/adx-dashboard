from PIL import Image, ImageDraw, ImageFont
import os

# 打开原图
input_path = r'C:\Users\MeetYou\AppData\Roaming\Qoder\SharedClientCache\cache\images\6fef0a0f\tapd_21039721_1775023110_970-2157f89b.png'
output_path = r'C:\Users\MeetYou\qoder\流程图-社区.png'

img = Image.open(input_path)
width, height = img.size
print(f"图片尺寸: {width} x {height}")

draw = ImageDraw.Draw(img)

# "孕育"的位置（根据图片估算，在左侧黄色区域上方）
# 大约在 x=22-28%, y=34-36% 的区域
text_x = int(width * 0.22)
text_y = int(height * 0.345)
text_w = int(width * 0.06)
text_h = int(height * 0.025)

print(f"覆盖区域: ({text_x}, {text_y}, {text_x + text_w}, {text_y + text_h})")

# 采样背景颜色（浅黄色）
# 在文字上方一点的位置采样
bg_x = text_x + text_w // 2
bg_y = text_y - 5
bg_color = img.getpixel((bg_x, bg_y))
print(f"背景颜色: {bg_color}")

# 用背景色覆盖"孕育"两个字
draw.rectangle([text_x - 5, text_y - 2, text_x + text_w + 5, text_y + text_h + 2], fill=bg_color)

# 尝试加载中文字体
font_paths = [
    r'C:\Windows\Fonts\msyh.ttc',  # 微软雅黑
    r'C:\Windows\Fonts\simsun.ttc', # 宋体
    r'C:\Windows\Fonts\simhei.ttf', # 黑体
]

font = None
for fp in font_paths:
    if os.path.exists(fp):
        try:
            font = ImageFont.truetype(fp, size=28)
            print(f"使用字体: {fp}")
            break
        except:
            continue

if font is None:
    font = ImageFont.load_default()
    print("使用默认字体")

# 写入"社区"
new_text = "社区"
# 计算文字位置使其居中在覆盖区域
try:
    bbox = draw.textbbox((0, 0), new_text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
except:
    text_width = text_w
    text_height = text_h

center_x = text_x + text_w // 2 - text_width // 2
center_y = text_y + text_h // 2 - text_height // 2

# 文字颜色（深灰色/黑色，与原来一致）
text_color = (60, 60, 60)
draw.text((center_x, center_y), new_text, font=font, fill=text_color)

# 保存
img.save(output_path)
print(f"已保存到: {output_path}")
