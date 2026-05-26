import re

with open('/Users/tukue/.gemini/antigravity/scratch/thoth_tarot_project/thoth-tarot-web/public/src/js/tree-of-life.js', 'r') as f:
    content = f.read()

# Sephira Meanings
meanings = {
    'meaning: "王冠"': 'meaning: "王冠", meaning_en: "Crown"',
    'meaning: "知恵"': 'meaning: "知恵", meaning_en: "Wisdom"',
    'meaning: "理解"': 'meaning: "理解", meaning_en: "Understanding"',
    'meaning: "慈悲"': 'meaning: "慈悲", meaning_en: "Mercy"',
    'meaning: "峻厳"': 'meaning: "峻厳", meaning_en: "Severity"',
    'meaning: "美"': 'meaning: "美", meaning_en: "Beauty"',
    'meaning: "勝利"': 'meaning: "勝利", meaning_en: "Victory"',
    'meaning: "栄光"': 'meaning: "栄光", meaning_en: "Splendor"',
    'meaning: "基礎"': 'meaning: "基礎", meaning_en: "Foundation"',
    'meaning: "王国"': 'meaning: "王国", meaning_en: "Kingdom"',
    'meaning: "知識"': 'meaning: "知識", meaning_en: "Knowledge"'
}

for k, v in meanings.items():
    content = content.replace(k, v)


# Hebrew Meanings
hebrew_meanings = {
    'hebrewMeaning: "雄牛"': 'hebrewMeaning: "雄牛", hebrewMeaning_en: "Ox"',
    'hebrewMeaning: "家"': 'hebrewMeaning: "家", hebrewMeaning_en: "House"',
    'hebrewMeaning: "駱駝"': 'hebrewMeaning: "駱駝", hebrewMeaning_en: "Camel"',
    'hebrewMeaning: "扉"': 'hebrewMeaning: "扉", hebrewMeaning_en: "Door"',
    'hebrewMeaning: "窓"': 'hebrewMeaning: "窓", hebrewMeaning_en: "Window"',
    'hebrewMeaning: "釘"': 'hebrewMeaning: "釘", hebrewMeaning_en: "Nail"',
    'hebrewMeaning: "剣"': 'hebrewMeaning: "剣", hebrewMeaning_en: "Sword"',
    'hebrewMeaning: "柵"': 'hebrewMeaning: "柵", hebrewMeaning_en: "Fence"',
    'hebrewMeaning: "蛇"': 'hebrewMeaning: "蛇", hebrewMeaning_en: "Serpent"',
    'hebrewMeaning: "手"': 'hebrewMeaning: "手", hebrewMeaning_en: "Hand"',
    'hebrewMeaning: "掌"': 'hebrewMeaning: "掌", hebrewMeaning_en: "Palm"',
    'hebrewMeaning: "牛突棒"': 'hebrewMeaning: "牛突棒", hebrewMeaning_en: "Ox Goad"',
    'hebrewMeaning: "水"': 'hebrewMeaning: "水", hebrewMeaning_en: "Water"',
    'hebrewMeaning: "魚"': 'hebrewMeaning: "魚", hebrewMeaning_en: "Fish"',
    'hebrewMeaning: "支柱"': 'hebrewMeaning: "支柱", hebrewMeaning_en: "Prop"',
    'hebrewMeaning: "目"': 'hebrewMeaning: "目", hebrewMeaning_en: "Eye"',
    'hebrewMeaning: "口"': 'hebrewMeaning: "口", hebrewMeaning_en: "Mouth"',
    'hebrewMeaning: "釣針"': 'hebrewMeaning: "釣針", hebrewMeaning_en: "Fishhook"',
    'hebrewMeaning: "後頭部"': 'hebrewMeaning: "後頭部", hebrewMeaning_en: "Back of Head"',
    'hebrewMeaning: "頭"': 'hebrewMeaning: "頭", hebrewMeaning_en: "Head"',
    'hebrewMeaning: "歯"': 'hebrewMeaning: "歯", hebrewMeaning_en: "Tooth"',
    'hebrewMeaning: "十字"': 'hebrewMeaning: "十字", hebrewMeaning_en: "Cross"'
}

for k, v in hebrew_meanings.items():
    content = content.replace(k, v)


with open('/Users/tukue/.gemini/antigravity/scratch/thoth_tarot_project/thoth-tarot-web/public/src/js/tree-of-life.js', 'w') as f:
    f.write(content)

