import json
import os
import re

API_JSON_PATH = "../thoth-tarot-api/tarot_data.json"
WEB_JS_PATH = "public/src/js/cards.js"
INDEX_HTML_PATH = "public/index.html"

updates = {
    "wands_knight": {
        "esoteric": {"sephira": "コクマー (Chokmah) の火", "astrology": "火のなかの火 (蠍座20度〜射手座20度)"},
        "symbols": [
            {"name": "黒い馬と燃え盛る炎", "desc": "爆発的で制御困難な純粋なエネルギー。雷光のような速度と暴力性。"},
            {"name": "松明（たいまつ）", "desc": "あらゆるものを焼き尽くし、新しいものを生み出す原初の意志。"}
        ]
    },
    "wands_queen": {
        "esoteric": {"sephira": "ビナー (Binah) の火", "astrology": "水のなかの火 (魚座20度〜牡羊座20度)"},
        "symbols": [
            {"name": "豹を撫でる女王", "desc": "荒々しい火のエネルギー（豹）を、感情と直感（水）で手懐け支配する力。"},
            {"name": "松ぼっくりの杖", "desc": "豊穣と生命の種子。燃え上がる情熱を現実の成長へと結びつける。"}
        ]
    },
    "wands_prince": {
        "esoteric": {"sephira": "ティファレト (Tiphareth) の火", "astrology": "風のなかの火 (蟹座20度〜獅子座20度)"},
        "symbols": [
            {"name": "ライオンが引く戦車", "desc": "火のエネルギーを知性（風）によって方向付け、目標へ向かって拡大していく力。"},
            {"name": "フェニックスの杖", "desc": "破壊と再生。古い思考パターンを燃やし尽くし、新しい理想へと飛翔する。"}
        ]
    },
    "wands_princess": {
        "esoteric": {"sephira": "マルクト (Malkuth) の火", "astrology": "地のなかの火 (白羊宮・獅子宮・人馬宮の天空)"},
        "symbols": [
            {"name": "裸の乙女と虎", "desc": "地の底で燃えるマグマのようなエネルギー。恐れを知らない原始的な衝動。"},
            {"name": "祭壇の炎", "desc": "霊的な火が物質界に定着し、具体的な熱や光となって現れる瞬間。"}
        ]
    },
    "cups_knight": {
        "esoteric": {"sephira": "コクマー (Chokmah) の水", "astrology": "火のなかの水 (水瓶座20度〜魚座20度)"},
        "symbols": [
            {"name": "白馬と輝く鎧", "desc": "水面を駆け抜ける熱い波。感情的な衝動、ロマンチシズム、熱狂的な献身。"},
            {"name": "蟹が描かれた杯", "desc": "攻撃的でありながらも、内面には傷つきやすい純粋な感情を隠し持っている。"}
        ]
    },
    "cups_queen": {
        "esoteric": {"sephira": "ビナー (Binah) の水", "astrology": "水のなかの水 (双子座20度〜蟹座20度)"},
        "symbols": [
            {"name": "静かな水面の上の玉座", "desc": "完全な受容性と反射。他者の感情を鏡のように映し出し、すべてを包み込む。"},
            {"name": "顔を隠すベール", "desc": "無意識の深淵。彼女自身の本性は見えず、底知れぬ神秘を秘めている。"}
        ]
    },
    "cups_prince": {
        "esoteric": {"sephira": "ティファレト (Tiphareth) の水", "astrology": "風のなかの水 (天秤座20度〜蠍座20度)"},
        "symbols": [
            {"name": "鷲が引く戦車", "desc": "感情（水）を知性（風）で冷徹に分析し、形を与えようとする複雑な精神状態。"},
            {"name": "蛇が巻きつく杯", "desc": "隠された意図や欲望。時には計算高く、目的のために感情を利用する。"}
        ]
    },
    "cups_princess": {
        "esoteric": {"sephira": "マルクト (Malkuth) の水", "astrology": "地のなかの水 (巨蟹宮・天蝎宮・双魚宮の天空)"},
        "symbols": [
            {"name": "踊る乙女と白鳥", "desc": "純粋な感情が物質界に結晶化した美しさ。優雅さ、ロマンス、無垢な喜び。"},
            {"name": "亀の甲羅を持つ杯", "desc": "感情が物質的な形（氷や結晶）となり、安定した愛情や芸術的才能として実を結ぶ。"}
        ]
    },
    "swords_knight": {
        "esoteric": {"sephira": "コクマー (Chokmah) の風", "astrology": "火のなかの風 (牡牛座20度〜双子座20度)"},
        "symbols": [
            {"name": "空を飛ぶ馬（プロペラのような動き）", "desc": "思考の猛烈なスピードと突撃。論理の刃を振り回し、障害を容赦なく切り裂く。"},
            {"name": "二刀流", "desc": "火と風の結合による狂信的な知性。目的のためには手段を選ばない過激さ。"}
        ]
    },
    "swords_queen": {
        "esoteric": {"sephira": "ビナー (Binah) の風", "astrology": "水のなかの風 (乙女座20度〜天秤座20度)"},
        "symbols": [
            {"name": "雲の上に座る女王", "desc": "感情の雲の上に立ち、完全に切り離された客観的で冷徹な観察者。"},
            {"name": "切断された男性の首", "desc": "不要な幻想や非論理的なものを、慈悲なく切り捨てる絶対的な知性。"}
        ]
    },
    "swords_prince": {
        "esoteric": {"sephira": "ティファレト (Tiphareth) の風", "astrology": "風のなかの風 (山羊座20度〜水瓶座20度)"},
        "symbols": [
            {"name": "妖精に引かれる幾何学的な戦車", "desc": "純粋な論理と理性の活動。規則正しく、目的のために完璧に組織化された思考。"},
            {"name": "剣と鎌", "desc": "思考を構築し、同時に不要なアイデアを刈り取る、絶え間ない精神的作業。"}
        ]
    },
    "swords_princess": {
        "esoteric": {"sephira": "マルクト (Malkuth) の風", "astrology": "地のなかの風 (双児宮・天秤宮・宝瓶宮の天空)"},
        "symbols": [
            {"name": "メデューサの首を持つ乙女", "desc": "空想やアイデアを現実の世界に引き下ろす（地の風）。時には破壊的で反抗的な現実主義。"},
            {"name": "吹き荒れる嵐と煙", "desc": "概念が物質と衝突して起きる摩擦。論理的な破壊と、その跡地での新しい創造。"}
        ]
    },
    "disks_knight": {
        "esoteric": {"sephira": "コクマー (Chokmah) の地", "astrology": "火のなかの地 (獅子座20度〜乙女座20度)"},
        "symbols": [
            {"name": "重々しい馬と農具", "desc": "大地を耕す力。忍耐強く、着実に物質的な利益や成果を生み出す労働のエネルギー。"},
            {"name": "太陽のような盾", "desc": "火のエネルギーが地に注がれ、植物を成長させるような生命を育む活力。"}
        ]
    },
    "disks_queen": {
        "esoteric": {"sephira": "ビナー (Binah) の地", "astrology": "水のなかの地 (射手座20度〜山羊座20度)"},
        "symbols": [
            {"name": "オアシスに座る女王", "desc": "生命を育む豊穣な大地。休息、滋養、そして物質的な豊かさの究極の受容態。"},
            {"name": "角のある兜と地球儀", "desc": "自然界の法則の理解と、現実世界（地球）における静かで確固たる支配力。"}
        ]
    },
    "disks_prince": {
        "esoteric": {"sephira": "ティファレト (Tiphareth) の地", "astrology": "風のなかの地 (牡羊座20度〜牡牛座20度)"},
        "symbols": [
            {"name": "牛が引く鉄の戦車", "desc": "物質の構造を論理的に理解し、建築物やシステムを作り上げる実用的な知性。"},
            {"name": "球体を持つ手", "desc": "具体的な計画、設計図の実行、そして目標に向けた揺るぎない現実的なアプローチ。"}
        ]
    },
    "disks_princess": {
        "esoteric": {"sephira": "マルクト (Malkuth) の地", "astrology": "地のなかの地 (金牛宮・処女宮・磨羯宮の天空)"},
        "symbols": [
            {"name": "木立の中に立つ妊娠した乙女", "desc": "純粋な物質、結実、生命の誕生。宇宙のエネルギーが完全に具現化された究極の形態。"},
            {"name": "羊の頭のついた杖", "desc": "新しいサイクルの始まり。古いものが土に還り、そこから新しい生命が芽吹く希望。"}
        ]
    }
}

def increment_version(match):
    prefix = match.group(1)
    current_version = int(match.group(2))
    return f"{prefix}{current_version + 1}"

def update_index_html():
    if not os.path.exists(INDEX_HTML_PATH):
        print(f"Warning: {INDEX_HTML_PATH} not found. Skipping cache buster update.")
        return

    with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = re.sub(r'(src/js/cards\.js\?v=)(\d+)', increment_version, content)
    new_content = re.sub(r'(src/js/app\.js\?v=)(\d+)', increment_version, new_content)

    if content != new_content:
        with open(INDEX_HTML_PATH, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Successfully updated cache busters in index.html.")
    else:
        print("No cache buster updates were needed in index.html.")

def main():
    with open(API_JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    for card in data.get("minor", []):
        if card["id"] in updates:
            card["esoteric"] = updates[card["id"]]["esoteric"]
            card["symbols"] = updates[card["id"]]["symbols"]

    with open(API_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    js_content = "// This file is automatically generated from local_tools/tarot_data.json\n"
    js_content += "// DO NOT EDIT MANUALLY\n\n"
    js_content += "const MAJOR_ARCANA = " + json.dumps(data["major"], ensure_ascii=False, indent=4) + ";\n\n"
    js_content += "const MINOR_ARCANA = " + json.dumps(data.get("minor", []), ensure_ascii=False, indent=4) + ";\n\n"
    js_content += "const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];\n"

    with open(WEB_JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_content)

    update_index_html()
    print("Successfully updated the Minor Arcana phase 5 (Court Cards) databases and cache busters.")

if __name__ == "__main__":
    main()
