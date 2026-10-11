"""Original Asteroids artwork. Integer raster primitives; no copied game assets."""
from PIL import Image, ImageDraw
from pathlib import Path
import math, random

OUT = Path(__file__).resolve().parents[1] / 'asteroids/src/content/game/art'
OUT.mkdir(exist_ok=True)
atlas = Image.new('RGBA', (2048, 1024))
colors = ['#7af4d3', '#ffbd76', '#a8a0ff', '#ff89a9']
def tile(index, image): atlas.paste(image, ((index%32)*64, (index//32)*64))
def point(x,y,angle):
    return (round(32+x*math.cos(angle)-y*math.sin(angle)),round(32+x*math.sin(angle)+y*math.cos(angle)))
for thrust in range(2):
    for player,color in enumerate(colors):
        for heading in range(32):
            angle=heading*math.tau/32
            image=Image.new('RGBA',(64,64));d=ImageDraw.Draw(image)
            if thrust:
                d.polygon([point(-7,-3,angle),point(-18,0,angle),point(-7,3,angle)],fill='#f48556')
                d.polygon([point(-7,-1,angle),point(-14,0,angle),point(-7,1,angle)],fill='#ffe8a4')
            polygon=[point(x,y,angle) for x,y in [(12,0),(-9,-7),(-5,0),(-9,7)]]
            d.polygon(polygon,fill='#152d43',outline=color,width=1)
            d.line([point(9,0,angle),point(-5,0,angle)],fill=color,width=2)
            d.polygon([point(x,y,angle) for x,y in [(4,0),(-1,-2),(-3,0),(-1,2)]],fill='#f2ffef')
            tile(thrust*128+player*32+heading,image)
stone_colors=[('#8eacc0','#273f58'),('#7cbea9','#254c51'),('#e7bb77','#694c39'),('#eb9a88','#683849'),('#b6a2ef','#483b6a')]
for shape in range(4):
    rng=random.Random(1200+shape)
    radii=[rng.uniform(18,24) for _ in range(11)]
    polygon=[(round(32+math.cos(i*math.tau/11)*r),round(32+math.sin(i*math.tau/11)*r)) for i,r in enumerate(radii)]
    for health,(light,dark) in enumerate(stone_colors):
        image=Image.new('RGBA',(64,64));d=ImageDraw.Draw(image)
        d.polygon(polygon,fill=dark,outline=light,width=2)
        d.line(polygon[:5],fill='#d7e6df',width=1)
        d.polygon([(20,24),(27,18),(34,21),(29,27),(22,28)],fill=light)
        d.line([(38,26),(43,30),(39,36),(43,41)],fill=light,width=1)
        d.line([(25,35),(29,37),(27,43)],fill='#101b2d',width=2)
        for i in range(health):d.rectangle((26+i*3,46,27+i*3,47),fill=light)
        tile(256+shape*5+health,image)
for i,color in enumerate(colors):
    image=Image.new('RGBA',(64,64));d=ImageDraw.Draw(image)
    d.rectangle((29,30,34,33),fill=color);d.rectangle((31,30,32,33),fill='#ffffff');tile(276+i,image)
for frame in range(16):
    image=Image.new('RGBA',(64,64));d=ImageDraw.Draw(image);rng=random.Random(900)
    for i in range(12):
        a=rng.random()*math.tau;r=(frame+1)*rng.uniform(.8,1.5)
        x=round(32+math.cos(a)*r);y=round(32+math.sin(a)*r)
        d.rectangle((x,y,x+1,y+1),fill=('#fff3b7' if frame<5 else '#fc9a77')+(format(max(0,255-frame*15),'02x')))
    tile(280+frame,image)
for i,color in enumerate(colors):
    image=Image.new('RGBA',(64,64));d=ImageDraw.Draw(image)
    for j in range(8):
        a=j*math.tau/8;d.line([point(15,0,a),point(15,0,a+.25)],fill=color,width=1)
    tile(296+i,image)
digits=[['00100','01100','00100','00100','00100','00100','01110'],
        ['01110','10001','00001','00010','00100','01000','11111'],
        ['11110','00001','00001','01110','00001','00001','11110'],
        ['00010','00110','01010','10010','11111','00010','00010']]
for i,rows in enumerate(digits):
    image=Image.new('RGBA',(64,64));d=ImageDraw.Draw(image)
    pixels=[(30+x,29+y) for y,row in enumerate(rows) for x,v in enumerate(row) if v=='1']
    for x,y in pixels:d.rectangle((x-1,y-1,x+1,y+1),fill='#07101e')
    for pixel in pixels:d.point(pixel,fill=colors[i])
    tile(300+i,image)
atlas.save(OUT/'sprites.png')

background=Image.new('RGB',(640,360),'#07101e');d=ImageDraw.Draw(background);rng=random.Random(4421)
for y in range(360):
    for x in range(640):
        v=math.exp(-((x-485)/220)**2-((y-110)/100)**2)
        if rng.random()<v*.065:d.point((x,y),fill='#101d32')
for i in range(175):
    x=rng.randrange(640);y=rng.randrange(360);color=rng.choice(['#24445a','#365168','#50717c','#869da5'])
    d.point((x,y),fill=color)
    if i%23==0:d.line((x-1,y,x+1,y),fill=color);d.line((x,y-1,x,y+1),fill=color)
background.save(OUT/'starfield.png')
gutter=Image.new('RGB',(512,512),'#080e1b');d=ImageDraw.Draw(gutter);rng=random.Random(12026)
for i in range(180):
    x=rng.randrange(512);y=rng.randrange(512)
    d.point((x,y),fill=rng.choice(['#172334','#1a2a3c','#203247']))
for cx,cy,r in [(90,130,34),(390,360,52),(350,55,19)]:
    polygon=[]
    for i in range(9):
        angle=i*math.tau/9;radius=r*rng.uniform(.7,1)
        polygon.append((round(cx+math.cos(angle)*radius),round(cy+math.sin(angle)*radius)))
    d.polygon(polygon,fill='#0b1525',outline='#1b2b3e',width=1)
    d.line([(cx-r//3,cy-r//3),(cx,cy-r//2),(cx+r//4,cy-r//3)],fill='#26364a',width=1)
gutter.save(OUT/'gutter.png')
print('Original directional ships, stone variants, projectiles, effects and starfield written.')

