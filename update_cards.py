import json
import os
import re

API_JSON_PATH = "../thoth-tarot-api/tarot_data.json"
WEB_JS_PATH = "public/src/js/cards.js"
INDEX_HTML_PATH = "public/index.html"

updates = {
    "tower": {
        "esoteric": {
            "hebrew": "ペー (Pe: 口)",
            "kabbalah": "ネツァク(7) - ホド(8) [第27のパス]",
            "astrology": "火星",
            "alchemy": "焼成（Calcination）。強烈な火によって不純物を焼き尽くし、純粋な灰だけを残す。",
            "iching": "震（しん） - 震為雷: 突然の衝撃と覚醒、古い構造の崩壊"
        },
        "symbols": [
            {
                "name": "崩れ落ちる塔と目",
                "desc": "神の目（シヴァの目）による幻想の破壊。エゴの要塞の崩壊。"
            },
            {
                "name": "炎を吐く口（ハデス/冥界）",
                "desc": "ペー（口）の象徴。すべてを飲み込み、浄化する力。"
            },
            {
                "name": "落ちていく人物",
                "desc": "旧来の形態や執着からの解放、幾何学的な結晶体への還元。"
            },
            {
                "name": "鳩（オリーブの枝）と蛇（アブラクサス）",
                "desc": "破壊の後に訪れる平和と、新しい生命の再生。"
            }
        ]
    },
    "star": {
        "esoteric": {
            "hebrew": "ヘー (He: 窓) ※クロウリー独自の配列",
            "kabbalah": "ホド(8) - イエソド(9) [第28のパス]",
            "astrology": "水瓶座",
            "alchemy": "蒸留と浄化。天上の水と地上の水の循環。大いなる星（ヌイト）からの注ぎ込み。",
            "iching": "渙（かん） - 風水渙: 散らす、滞りからの解放と広がり"
        },
        "symbols": [
            {
                "name": "裸の女神（ヌイト/ハトホル）",
                "desc": "無限の宇宙の星空、すべての可能性を内包する母なる夜。"
            },
            {
                "name": "金の杯と銀の杯",
                "desc": "永遠の生命の水と、物質界への具現化。エネルギーの注ぎ込み。"
            },
            {
                "name": "七芒星（セプタグラム）",
                "desc": "バビロンの星、金星のエネルギー、愛と美の超越的な現れ。"
            },
            {
                "name": "結晶化する幾何学模様",
                "desc": "純化されたエネルギーが物質界で完璧な形を成すプロセス。"
            }
        ]
    },
    "moon": {
        "esoteric": {
            "hebrew": "コフ (Qoph: 後頭部)",
            "kabbalah": "ネツァク(7) - マルクト(10) [第29のパス]",
            "astrology": "魚座",
            "alchemy": "月の血（メンストルム）。潜在意識の海から形を成す前の毒と薬の混交。",
            "iching": "坎（かん） - 坎為水: 険難と深淵、無意識の暗い海を渡る"
        },
        "symbols": [
            {
                "name": "2つの塔（アヌビスのジャッカル）",
                "desc": "生と死の境界線を守る者。潜在意識への入り口。"
            },
            {
                "name": "スカラベ（フンコロガシ）と太陽",
                "desc": "ケプリ神。真夜中の太陽、最も暗い場所から始まる再生の兆し。"
            },
            {
                "name": "毒々しい血の池",
                "desc": "無意識の底に沈む恐怖や幻想。これを越えなければ光には到達できない。"
            },
            {
                "name": "不気味な波と満ち欠けする月",
                "desc": "幻影、魔術的イリュージョン、周期的なリズム。"
            }
        ]
    },
    "sun": {
        "esoteric": {
            "hebrew": "レシュ (Resh: 頭)",
            "kabbalah": "ホド(8) - マルクト(10) [第30のパス]",
            "astrology": "太陽",
            "alchemy": "発酵と増殖。黄金の完全な生成。意識の光による完全な統合。",
            "iching": "離（り） - 離為火: 明るい光、付着と知性の輝き"
        },
        "symbols": [
            {
                "name": "踊る双子の子供",
                "desc": "新しい時代（ホルスの時代）の象徴。無邪気さ、完全な自由と自己表現。"
            },
            {
                "name": "12の光線を放つ太陽",
                "desc": "黄道十二宮の完全な支配。生命の源泉、創造的なエネルギーの中心。"
            },
            {
                "name": "薔薇と十字の丘",
                "desc": "錬金術の到達点（薔薇十字）。神聖な霊と物質の完全な融合。"
            },
            {
                "name": "緑の蝶と翼ある球体",
                "desc": "魂の復活、変容の完了と軽やかな飛翔。"
            }
        ]
    },
    "aeon": {
        "esoteric": {
            "hebrew": "シン (Shin: 歯/火)",
            "kabbalah": "ホド(8) - マルクト(10) [第31のパス]",
            "astrology": "火のエレメント",
            "alchemy": "炎による最終的な変容。三位一体の火が万物を新しいサイクルへと押し上げる。",
            "iching": "革（かく） - 沢火革: 変革と更新、古い時代から新しい時代への移行"
        },
        "symbols": [
            {
                "name": "ヌイト（星空の女神）とハディト（翼ある球体）",
                "desc": "宇宙の無限の空間（母）と、中心にある極微の点（父）。"
            },
            {
                "name": "双子のホルス（沈黙の子供と戦士）",
                "desc": "ホール・パアル・クラートとラー・ホール・クイト。新しい時代（アイオン）の到来。"
            },
            {
                "name": "胎児の透明な姿",
                "desc": "次の次元への生まれ変わり、霊的な進化の次のステップ。"
            },
            {
                "name": "炎の文字シン",
                "desc": "破壊と創造を同時に行う霊的な火のエネルギー。"
            }
        ]
    },
    "universe": {
        "esoteric": {
            "hebrew": "タヴ (Tau: 十字架/印)",
            "kabbalah": "イエソド(9) - マルクト(10) [第32のパス]",
            "astrology": "土星 / 地のエレメント",
            "alchemy": "凝固（Coagulatio）の完成。霊の完全なる物質化であり、大いなる作業の完了。",
            "iching": "坤（こん） - 坤為地: 完全な受容と包容、すべてを現実化する母なる大地"
        },
        "symbols": [
            {
                "name": "踊る乙女と大蛇",
                "desc": "純化された物質界（マルクト）と、それを貫くクンダリーニのエネルギー。"
            },
            {
                "name": "星々の楕円形の輪（マンドルラ）",
                "desc": "宇宙の卵、または女陰（ヨニ）。完全な世界と境界線。"
            },
            {
                "name": "四つのケルビム（牛、獅子、鷲、人）",
                "desc": "四大元素の完全な固定と、物質界の四隅の安定。"
            },
            {
                "name": "骨組みのような土星の構造",
                "desc": "時間の制限と物質界の法則、そしてそれを完全に理解した上での自由。"
            }
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

    # Automatically increment cards.js?v=XX and app.js?v=XX
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
    
    for card in data["major"]:
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

    # Cache buster automatic update
    update_index_html()

    print("Successfully updated the databases and cache busters.")

if __name__ == "__main__":
    main()
