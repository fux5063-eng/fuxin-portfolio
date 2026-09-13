# -*- coding: utf-8 -*-
"""生成作品集网站二维码：浅底版（网页/简历）+ 深底版（深色首屏）+ 高清版（打印/简历）"""
import os
import qrcode
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image

URL = 'https://fux5063-eng.github.io/fuxin-portfolio/'
OUT = 'E:/01_记忆共享空间/02_Hermes/fuxin-portfolio/assets/img/qr/'
os.makedirs(OUT, exist_ok=True)


def make(fill, back, size, name, border=3):
    q = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_H, box_size=20, border=border)
    q.add_data(URL)
    q.make(fit=True)
    img = q.make_image(fill_color=fill, back_color=back).convert('RGBA')
    img = img.resize((size, size), Image.NEAREST if size % img.size[0] == 0 else Image.LANCZOS)
    p = OUT + name
    img.save(p)
    print(f'{name:22s} {img.size} {os.path.getsize(p)//1024}KB')


make('#111214', '#ffffff', 512, 'site-512.png')
make('#111214', '#ffffff', 1024, 'site-1024.png')
# 深色底：模块为白，背景透明（放在深色首屏/深色页脚上）
make('#ffffff', None, 512, 'site-invert-512.png')

# 拼一张预览
imgs = [Image.open(OUT + n).convert('RGBA') for n in ['site-512.png', 'site-invert-512.png']]
cv = Image.new('RGBA', (imgs[0].width * 2 + 60, imgs[0].height + 40), (255, 255, 255, 255))
cv.paste(imgs[0], (20, 20), imgs[0])
dark = Image.new('RGBA', imgs[1].size, (14, 15, 18, 255))
dark.paste(imgs[1], (0, 0), imgs[1])
cv.paste(dark, (imgs[0].width + 40, 20), dark)
cv.convert('RGB').save(OUT + '_preview.png')
print('预览:', OUT + '_preview.png')
