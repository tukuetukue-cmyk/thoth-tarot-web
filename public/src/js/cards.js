const MAJOR_ARCANA = [
    {
        id: "fool", name: "愚者 (The Fool)", type: "major", number: 0, element: "Air",
        image: 'assets/images/cards/fool_rm.jpg',
        keywords: ["無垢", "可能性", "自由", "始まり"],
        esoteric: { hebrew: "アレフ (Aleph: 雄牛)", kabbalah: "ケテル(1) - コクマ(2) [第11のパス]", astrology: "風のエレメント", alchemy: "風（気）の要素、無からの創造" },
        symbols: [{ name: "ワニ", desc: "創造的エネルギー", rect: {x: 60, y: 75, w: 35, h: 20} }, { name: "虎", desc: "恐れを鎮める力", rect: {x: 5, y: 75, w: 30, h: 20} }]
    },
    {
        id: "magus", name: "魔術師 (The Magus)", type: "major", number: 1, element: "Air (水星)",
        image: 'assets/images/cards/magus_rm.jpg',
        keywords: ["コミュニケーション", "技巧", "伝達", "知性"],
        esoteric: { hebrew: "ベート (Beth: 家)", kabbalah: "ケテル(1) - ビナー(3) [第12のパス]", astrology: "水星", alchemy: "哲学者の水銀（メルクリウス）、流動性と伝達" },
        symbols: [{ name: "猿", desc: "機敏さ、言葉", rect: {x: 5, y: 80, w: 25, h: 15} }, { name: "杖", desc: "意志の力", rect: {x: 40, y: 10, w: 20, h: 25} }]
    },
    {
        id: "priestess", name: "女教皇 (The Priestess)", type: "major", number: 2, element: "Water (月)",
        image: 'assets/images/cards/priestess_rm.jpg',
        keywords: ["直感", "潜在意識", "純粋さ", "受容"],
        esoteric: { hebrew: "ギメル (Gimel: ラクダ)", kabbalah: "ケテル(1) - ティファレト(6) [第13のパス]", astrology: "月", alchemy: "純粋な銀、受容の器" },
        symbols: [{ name: "ラクダ", desc: "砂漠を越える力、自己充足", rect: {x: 75, y: 85, w: 20, h: 10} }, { name: "弓", desc: "上昇する精神", rect: {x: 20, y: 25, w: 60, h: 50} }]
    },
    {
        id: "empress", name: "女帝 (The Empress)", type: "major", number: 3, element: "Earth (金星)",
        image: 'assets/images/cards/empress_rm.jpg',
        keywords: ["愛", "美", "豊穣", "母性"],
        esoteric: { hebrew: "ダレット (Daleth: 扉)", kabbalah: "コクマ(2) - ビナー(3) [第14のパス]", astrology: "金星", alchemy: "銅（金星）、塩・豊かさを生み出す母体" },
        symbols: [{ name: "ペリカン", desc: "自己犠牲と母性", rect: {x: 65, y: 75, w: 25, h: 20} }, { name: "蓮", desc: "純潔と再生", rect: {x: 10, y: 60, w: 25, h: 30} }]
    },
    {
        id: "emperor", name: "皇帝 (The Emperor)", type: "major", number: 4, element: "Fire (牡羊座)",
        image: 'assets/images/cards/emperor_rm.jpg',
        keywords: ["権力", "秩序", "支配", "構築"],
        esoteric: { hebrew: "ツァディ (Tzaddi: 釣り針) ※クロウリー独自の配列", kabbalah: "ネツァク(7) - イエソド(9) [第28のパス]", astrology: "牡羊座", alchemy: "硫黄（上昇する熱）、活性化する力" },
        symbols: [{ name: "羊", desc: "牡羊座の象徴、行動力", rect: {x: 5, y: 70, w: 30, h: 25} }, { name: "鷲", desc: "高い視座と権威", rect: {x: 55, y: 35, w: 40, h: 35} }]
    },
    {
        id: "hierophant", name: "神官 (The Hierophant)", type: "major", number: 5, element: "Earth (牡牛座)",
        image: 'assets/images/cards/hierophant_rm.jpg',
        keywords: ["伝統", "教え", "啓示", "オカルト"],
        esoteric: { hebrew: "ヴァヴ (Vau: 釘)", kabbalah: "コクマ(2) - ケセド(4) [第16のパス]", astrology: "牡牛座", alchemy: "凝固（Coagulation）、スピリットの物質化" },
        symbols: [{ name: "牡牛", desc: "忍耐と力", rect: {x: 25, y: 55, w: 50, h: 35} }, { name: "五芒星", desc: "精神と物質の結合", rect: {x: 40, y: 15, w: 20, h: 15} }]
    },
    {
        id: "lovers", name: "恋人たち (The Lovers)", type: "major", number: 6, element: "Air (双子座)",
        image: 'assets/images/cards/lovers_rm.jpg',
        keywords: ["選択", "結合", "インスピレーション", "錬金術的結婚"],
        esoteric: { hebrew: "ザイン (Zain: 剣)", kabbalah: "ビナー(3) - ティファレト(6) [第17のパス]", astrology: "双子座", alchemy: "溶解（Solve）と結合（Coagula）の序章、二元性の対峙" },
        symbols: [{ name: "剣", desc: "分離と決断" }, { name: "蛇と卵", desc: "宇宙の再生" }]
    },
    {
        id: "chariot", name: "戦車 (The Chariot)", type: "major", number: 7, element: "Water (蟹座)",
        image: 'assets/images/cards/chariot_rm.jpg',
        keywords: ["勝利", "意志の力", "探求", "自己のコントロール"],
        esoteric: { hebrew: "ヘス (Cheth: 柵)", kabbalah: "ビナー(3) - ゲブラー(5) [第18のパス]", astrology: "蟹座", alchemy: "聖杯による受容と錬金術的変容の準備" },
        symbols: [{ name: "聖杯", desc: "受容性" }, { name: "スフィンクス", desc: "四要素の統合" }]
    },
    {
        id: "adjustment", name: "調整 (Adjustment)", type: "major", number: 8, element: "Air (天秤座)",
        image: 'assets/images/cards/adjustment_rm.jpg',
        keywords: ["バランス", "カルマ", "正義", "行動の結果"],
        esoteric: { hebrew: "ラメド (Lamed: 鞭)", kabbalah: "ゲブラー(5) - ティファレト(6) [第22のパス]", astrology: "天秤座", alchemy: "バランスを通じた純化と昇華、無駄の削ぎ落とし" },
        symbols: [{ name: "天秤", desc: "均衡" }, { name: "剣", desc: "明確な判断" }]
    },
    {
        id: "hermit", name: "隠者 (The Hermit)", type: "major", number: 9, element: "Earth (乙女座)",
        image: 'assets/images/cards/hermit_rm.jpg',
        keywords: ["内省", "知恵", "職人技", "孤独", "光"],
        esoteric: { hebrew: "ヨッド (Yod: 手)", kabbalah: "ケセド(4) - ティファレト(6) [第20のパス]", astrology: "乙女座", alchemy: "内なる光への還元、霊的な熟成" },
        symbols: [
            { name: "手（ヨッド）", desc: "神の創造の力、活動するロゴス" },
            { name: "ケルベロス", desc: "過去・現在・未来の克服" },
            { name: "小麦畑", desc: "豊かな実りの約束、乙女座の象徴" },
            { name: "オルフェウスの卵", desc: "新たな生命、宇宙の始まり" }
        ]
    },
    {
        id: "fortune", name: "運命の輪 (Fortune)", type: "major", number: 10, element: "Fire (木星)",
        image: 'assets/images/cards/fortune_rm.jpg',
        keywords: ["変化", "周期", "運命", "チャンス"],
        esoteric: { hebrew: "カフ (Kaph: 掌)", kabbalah: "ケセド(4) - ネツァク(7) [第21のパス]", astrology: "木星", alchemy: "三原基（硫黄・水銀・塩）の絶え間ない循環機構" },
        symbols: [{ name: "車輪", desc: "絶え間ない変化" }, { name: "３つの姿", desc: "創造・維持・破壊" }]
    },
    {
        id: "lust", name: "欲望 (Lust)", type: "major", number: 11, element: "Fire (獅子座)",
        image: 'assets/images/cards/lust_rm.jpg',
        keywords: ["情熱", "生命力", "強さ", "本能の受容"],
        esoteric: { hebrew: "テス (Teth: 蛇)", kabbalah: "ケセド(4) - ゲブラー(5) [第19のパス]", astrology: "獅子座", alchemy: "生命エネルギーの発酵と昇華、獣性の霊的転化" },
        symbols: [{ name: "獅子", desc: "生のエネルギー" }, { name: "バビロンの聖杯", desc: "全ての生命の血" }]
    },
    {
        id: "hanged-man", name: "吊るされた男 (The Hanged Man)", type: "major", number: 12, element: "Water",
        image: 'assets/images/cards/hanged-man_rm.jpg',
        keywords: ["犠牲", "視点の転換", "降伏", "束縛"],
        esoteric: { hebrew: "メム (Mem: 水)", kabbalah: "ゲブラー(5) - ホド(8) [第23のパス]", astrology: "水のエレメント", alchemy: "溶解（Solve）、個我からの解放と自己犠牲" },
        symbols: [{ name: "逆位置", desc: "異なる視点" }, { name: "蛇", desc: "変容への力" }]
    },
    {
        id: "death", name: "死神 (Death)", type: "major", number: 13, element: "Water (蠍座)",
        image: 'assets/images/cards/death_rm.jpg',
        keywords: ["変容", "手放す", "再生", "必然の終わり"],
        esoteric: { hebrew: "ヌン (Nun: 魚)", kabbalah: "ティファレト(6) - ネツァク(7) [第24のパス]", astrology: "蠍座", alchemy: "腐敗（Putrefactio）、古い形の完全な死と霊的再生の種" },
        symbols: [{ name: "大鎌", desc: "刈り取りと浄化" }, { name: "蠍と蛇と鷲", desc: "変容の３つの段階" }]
    },
    {
        id: "art", name: "技 (Art)", type: "major", number: 14, element: "Fire (射手座)",
        image: 'assets/images/cards/art_rm.jpg',
        keywords: ["統合", "錬金術", "バランス", "融合"],
        esoteric: { hebrew: "サメフ (Samekh: 支柱)", kabbalah: "ティファレト(6) - イエソド(9) [第25のパス]", astrology: "射手座", alchemy: "V.I.T.R.I.O.L. 結合（Coagula）、火と水の融合、賢者の石の創造" },
        symbols: [{ name: "大釜", desc: "変容の器" }, { name: "虹", desc: "完成された状態" }]
    },
    {
        id: "devil", name: "悪魔 (The Devil)", type: "major", number: 15, element: "Earth (山羊座)",
        image: 'assets/images/cards/devil_rm.jpg',
        keywords: ["物質的欲求", "ユーモア", "生命の源", "創造力"],
        esoteric: { hebrew: "アイン (Ayin: 目)", kabbalah: "ティファレト(6) - ホド(8) [第26のパス]", astrology: "山羊座", alchemy: "物質化の極致から見出す霊的な光、凝固の極み" },
        symbols: [{ name: "山羊", desc: "地に足のついた生命力" }, { name: "目", desc: "すべてを見通す光" }]
    },
    {
        id: "tower", name: "塔 (The Tower)", type: "major", number: 16, element: "Fire (火星)",
        image: 'assets/images/cards/tower_rm.jpg',
        keywords: ["破壊", "突破", "浄化", "パラダイムシフト"],
        esoteric: { hebrew: "ペー (Pe: 口)", kabbalah: "ネツァク(7) - ホド(8) [第27のパス]", astrology: "火星", alchemy: "煅焼（Calcination）、熱による古い構造の容赦なき破壊" },
        symbols: [{ name: "目", desc: "シヴァの破壊の目" }, { name: "炎", desc: "古い構造の浄化" }]
    },
    {
        id: "star", name: "星 (The Star)", type: "major", number: 17, element: "Air (水瓶座)",
        image: 'assets/images/cards/star_rm.jpg',
        keywords: ["希望", "インスピレーション", "純粋さ", "将来の展望"],
        esoteric: { hebrew: "ヘー (He: 窓) ※クロウリー独自の配列", kabbalah: "コクマ(2) - ティファレト(6) [第15のパス]", astrology: "水瓶座", alchemy: "蒸留・濾過、継続的な浄化と霊的な滋養の供給" },
        symbols: [{ name: "７角星", desc: "神聖な光" }, { name: "杯", desc: "無限に注がれるエネルギー" }]
    },
    {
        id: "moon", name: "月 (The Moon)", type: "major", number: 18, element: "Water (魚座)",
        image: 'assets/images/cards/moon_rm.jpg',
        keywords: ["幻想", "無意識", "恐れ", "魔術"],
        esoteric: { hebrew: "コフ (Qoph: 後頭部)", kabbalah: "ネツァク(7) - マルクト(10) [第29のパス]", astrology: "魚座", alchemy: "無意識の暗闇を通過する変容の最終試練" },
        symbols: [{ name: "アヌビス", desc: "冥界の番人" }, { name: "スカラベ", desc: "闇の中からの再生" }]
    },
    {
        id: "sun", name: "太陽 (The Sun)", type: "major", number: 19, element: "Fire (太陽)",
        image: 'assets/images/cards/sun_rm.jpg',
        keywords: ["栄光", "生命力", "明晰さ", "自由"],
        esoteric: { hebrew: "レシュ (Resh: 頭)", kabbalah: "ホド(8) - イエソド(9) [第30のパス]", astrology: "太陽", alchemy: "黄金への変成、生命と意識の完全な開花" },
        symbols: [{ name: "踊る子供たち", desc: "古い制限からの解放" }, { name: "薔薇十字", desc: "完成された調和" }]
    },
    {
        id: "aeon", name: "永劫 (The Aeon)", type: "major", number: 20, element: "Fire",
        image: 'assets/images/cards/aeon_rm.jpg',
        keywords: ["新しい時代", "最終決断", "一歩踏み出す", "視野の拡大"],
        esoteric: { hebrew: "シン (Shin: 歯)", kabbalah: "ホド(8) - マルクト(10) [第31のパス]", astrology: "火のエレメント", alchemy: "霊なる火、最後の抽出・新しいサイクルの始まり" },
        symbols: [{ name: "ホルス", desc: "新しい時代の子供" }, { name: "ハディト", desc: "内なる光の点" }]
    },
    {
        id: "universe", name: "宇宙 (The Universe)", type: "major", number: 21, element: "Earth (土星)",
        image: 'assets/images/cards/universe_rm.jpg',
        keywords: ["完成", "全体性", "グランドフィナーレ", "制限と構造"],
        esoteric: { hebrew: "タヴ (Tau: 十字)", kabbalah: "イエソド(9) - マルクト(10) [第32のパス]", astrology: "土星", alchemy: "大いなる作業（マグヌス・オプス）の完成、四元素の統合" },
        symbols: [{ name: "踊る乙女", desc: "宇宙を構成する神聖な舞" }, { name: "蛇と星の輪", desc: "無限の宇宙空間" }]
    }
];

const MINOR_ARCANA = [
    {
        id: "disks_3", name: "作業 (Works)", type: "minor", number: "3", element: "地・山羊座の火星",
        image: 'assets/images/cards/disks_3_rm.jpg',
        keywords: ["作業"],
        symbols: []
    },
    {
        id: "disks_8", name: "慎重 (Prudence)", type: "minor", number: "8", element: "地・乙女座の太陽",
        image: 'assets/images/cards/disks_8_rm.jpg',
        keywords: ["慎重"],
        symbols: []
    },
    {
        id: "cups_princess", name: "Princess の カップ (Princess of Cups)", type: "minor", number: "princess", element: "水の地",
        image: 'assets/images/cards/cups_princess_rm.jpg',
        keywords: ["結実する感情"],
        symbols: []
    },
    {
        id: "disks_1", name: "根源的な地力 (Ace of Disks)", type: "minor", number: "1", element: "地",
        image: 'assets/images/cards/disks_1_rm.jpg',
        keywords: ["根源的な地力"],
        symbols: []
    },
    {
        id: "wands_8", name: "迅速 (Swiftness)", type: "minor", number: "8", element: "火・射手座の水星",
        image: 'assets/images/cards/wands_8_rm.jpg',
        keywords: ["迅速"],
        symbols: []
    },
    {
        id: "disks_prince", name: "Prince の ディスク (Prince of Disks)", type: "minor", number: "prince", element: "地の風",
        image: 'assets/images/cards/disks_prince_rm.jpg',
        keywords: ["計画と実効性"],
        symbols: []
    },
    {
        id: "swords_3", name: "悲哀 (Sorrow)", type: "minor", number: "3", element: "風・天秤座の土星",
        image: 'assets/images/cards/swords_3_rm.jpg',
        keywords: ["悲哀"],
        symbols: []
    },
    {
        id: "wands_2", name: "支配 (Dominion)", type: "minor", number: "2", element: "火・牡羊座の火星",
        image: 'assets/images/cards/wands_2_rm.jpg',
        keywords: ["支配"],
        symbols: []
    },
    {
        id: "disks_princess", name: "Princess の ディスク (Princess of Disks)", type: "minor", number: "princess", element: "地の地",
        image: 'assets/images/cards/disks_princess_rm.jpg',
        keywords: ["物質的基盤"],
        symbols: []
    },
    {
        id: "cups_10", name: "飽食 (Satiety)", type: "minor", number: "10", element: "水・魚座の火星",
        image: 'assets/images/cards/cups_10_rm.jpg',
        keywords: ["飽食"],
        symbols: []
    },
    {
        id: "disks_10", name: "富 (Wealth)", type: "minor", number: "10", element: "地・乙女座の水星",
        image: 'assets/images/cards/disks_10_rm.jpg',
        keywords: ["富"],
        symbols: []
    },
    {
        id: "disks_knight", name: "Knight の ディスク (Knight of Disks)", type: "minor", number: "knight", element: "地の火",
        image: 'assets/images/cards/disks_knight_rm.jpg',
        keywords: ["確実な進歩と労働"],
        symbols: []
    },
    {
        id: "wands_7", name: "勇気 (Valor)", type: "minor", number: "7", element: "火・獅子座の火星",
        image: 'assets/images/cards/wands_7_rm.jpg',
        keywords: ["勇気"],
        symbols: []
    },
    {
        id: "swords_4", name: "休戦 (Truce)", type: "minor", number: "4", element: "風・天秤座の木星",
        image: 'assets/images/cards/swords_4_rm.jpg',
        keywords: ["休戦"],
        symbols: []
    },
    {
        id: "swords_9", name: "残酷 (Cruelty)", type: "minor", number: "9", element: "風・双子座の火星",
        image: 'assets/images/cards/swords_9_rm.jpg',
        keywords: ["残酷"],
        symbols: []
    },
    {
        id: "disks_4", name: "力 (Power)", type: "minor", number: "4", element: "地・山羊座の太陽",
        image: 'assets/images/cards/disks_4_rm.jpg',
        keywords: ["力"],
        symbols: []
    },
    {
        id: "disks_queen", name: "Queen の ディスク (Queen of Disks)", type: "minor", number: "queen", element: "地の水",
        image: 'assets/images/cards/disks_queen_rm.jpg',
        keywords: ["豊穣と育み"],
        symbols: []
    },
    {
        id: "cups_knight", name: "Knight の カップ (Knight of Cups)", type: "minor", number: "knight", element: "水の火",
        image: 'assets/images/cards/cups_knight_rm.jpg',
        keywords: ["芸術的推進力"],
        symbols: []
    },
    {
        id: "cups_8", name: "怠惰 (Indolence)", type: "minor", number: "8", element: "水・魚座の土星",
        image: 'assets/images/cards/cups_8_rm.jpg',
        keywords: ["怠惰"],
        symbols: []
    },
    {
        id: "disks_5", name: "心配 (Worry)", type: "minor", number: "5", element: "地・牡牛座の水星",
        image: 'assets/images/cards/disks_5_rm.jpg',
        keywords: ["心配"],
        symbols: []
    },
    {
        id: "cups_6", name: "喜び (Pleasure)", type: "minor", number: "6", element: "水・蠍座の太陽",
        image: 'assets/images/cards/cups_6_rm.jpg',
        keywords: ["喜び"],
        symbols: []
    },
    {
        id: "cups_9", name: "幸福 (Happiness)", type: "minor", number: "9", element: "水・魚座の木星",
        image: 'assets/images/cards/cups_9_rm.jpg',
        keywords: ["幸福"],
        symbols: []
    },
    {
        id: "wands_3", name: "美徳 (Virtue)", type: "minor", number: "3", element: "火・牡羊座の太陽",
        image: 'assets/images/cards/wands_3_rm.jpg',
        keywords: ["美徳"],
        symbols: []
    },
    {
        id: "wands_10", name: "圧迫 (Oppression)", type: "minor", number: "10", element: "火・射手座の土星",
        image: 'assets/images/cards/wands_10_rm.jpg',
        keywords: ["圧迫"],
        symbols: []
    },
    {
        id: "wands_1", name: "根源的な火力 (Ace of Wands)", type: "minor", number: "1", element: "火",
        image: 'assets/images/cards/wands_1_rm.jpg',
        keywords: ["根源的な火力"],
        symbols: []
    },
    {
        id: "swords_2", name: "平和 (Peace)", type: "minor", number: "2", element: "風・天秤座の月",
        image: 'assets/images/cards/swords_2_rm.jpg',
        keywords: ["平和"],
        symbols: []
    },
    {
        id: "swords_queen", name: "Queen の ソード (Queen of Swords)", type: "minor", number: "queen", element: "風の水",
        image: 'assets/images/cards/swords_queen_rm.jpg',
        keywords: ["明晰さと冷徹さ"],
        symbols: []
    },
    {
        id: "disks_2", name: "変化 (Change)", type: "minor", number: "2", element: "地・山羊座の木星",
        image: 'assets/images/cards/disks_2_rm.jpg',
        keywords: ["変化"],
        symbols: []
    },
    {
        id: "cups_1", name: "根源的な水力 (Ace of Cups)", type: "minor", number: "1", element: "水",
        image: 'assets/images/cards/cups_1_rm.jpg',
        keywords: ["根源的な水力"],
        symbols: []
    },
    {
        id: "swords_8", name: "干渉 (Interference)", type: "minor", number: "8", element: "風・双子座の木星",
        image: 'assets/images/cards/swords_8_rm.jpg',
        keywords: ["干渉"],
        symbols: []
    },
    {
        id: "swords_6", name: "科学 (Science)", type: "minor", number: "6", element: "風・水瓶座の水星",
        image: 'assets/images/cards/swords_6_rm.jpg',
        keywords: ["科学"],
        symbols: []
    },
    {
        id: "swords_knight", name: "Knight の ソード (Knight of Swords)", type: "minor", number: "knight", element: "風の火",
        image: 'assets/images/cards/swords_knight_rm.jpg',
        keywords: ["理屈と積極性"],
        symbols: []
    },
    {
        id: "wands_4", name: "完全 (Completion)", type: "minor", number: "4", element: "火・牡羊座の金星",
        image: 'assets/images/cards/wands_4_rm.jpg',
        keywords: ["完全"],
        symbols: []
    },
    {
        id: "swords_10", name: "破滅 (Ruin)", type: "minor", number: "10", element: "風・双子座の太陽",
        image: 'assets/images/cards/swords_10_rm.jpg',
        keywords: ["破滅"],
        symbols: []
    },
    {
        id: "swords_princess", name: "Princess の ソード (Princess of Swords)", type: "minor", number: "princess", element: "風の地",
        image: 'assets/images/cards/swords_princess_rm.jpg',
        keywords: ["論理の具現化"],
        symbols: []
    },
    {
        id: "cups_3", name: "豊かさ (Abundance)", type: "minor", number: "3", element: "水・蟹座の水星",
        image: 'assets/images/cards/cups_3_rm.jpg',
        keywords: ["豊かさ"],
        symbols: []
    },
    {
        id: "swords_7", name: "無益 (Futility)", type: "minor", number: "7", element: "風・水瓶座の月",
        image: 'assets/images/cards/swords_7_rm.jpg',
        keywords: ["無益"],
        symbols: []
    },
    {
        id: "cups_2", name: "愛 (Love)", type: "minor", number: "2", element: "水・蟹座の金星",
        image: 'assets/images/cards/cups_2_rm.jpg',
        keywords: ["愛"],
        symbols: []
    },
    {
        id: "cups_7", name: "堕落 (Debauch)", type: "minor", number: "7", element: "水・蠍座の金星",
        image: 'assets/images/cards/cups_7_rm.jpg',
        keywords: ["堕落"],
        symbols: []
    },
    {
        id: "disks_6", name: "成功 (Success)", type: "minor", number: "6", element: "地・牡牛座の月",
        image: 'assets/images/cards/disks_6_rm.jpg',
        keywords: ["成功"],
        symbols: []
    },
    {
        id: "disks_7", name: "失敗 (Failure)", type: "minor", number: "7", element: "地・牡牛座の土星",
        image: 'assets/images/cards/disks_7_rm.jpg',
        keywords: ["失敗"],
        symbols: []
    },
    {
        id: "wands_queen", name: "Queen の ワンド (Queen of Wands)", type: "minor", number: "queen", element: "火の水",
        image: 'assets/images/cards/wands_queen_rm.jpg',
        keywords: ["直感と魅力"],
        symbols: []
    },
    {
        id: "wands_prince", name: "Prince の ワンド (Prince of Wands)", type: "minor", number: "prince", element: "火の風",
        image: 'assets/images/cards/wands_prince_rm.jpg',
        keywords: ["知性と決断"],
        symbols: []
    },
    {
        id: "wands_5", name: "闘争 (Strife)", type: "minor", number: "5", element: "火・獅子座の土星",
        image: 'assets/images/cards/wands_5_rm.jpg',
        keywords: ["闘争"],
        symbols: []
    },
    {
        id: "wands_9", name: "力 (Strength)", type: "minor", number: "9", element: "火・射手座の月",
        image: 'assets/images/cards/wands_9_rm.jpg',
        keywords: ["力"],
        symbols: []
    },
    {
        id: "cups_4", name: "贅沢 (Luxury)", type: "minor", number: "4", element: "水・蟹座の月",
        image: 'assets/images/cards/cups_4_rm.jpg',
        keywords: ["贅沢"],
        symbols: []
    },
    {
        id: "swords_prince", name: "Prince の ソード (Prince of Swords)", type: "minor", number: "prince", element: "風の風",
        image: 'assets/images/cards/swords_prince_rm.jpg',
        keywords: ["純粋な思考"],
        symbols: []
    },
    {
        id: "disks_9", name: "獲得 (Gain)", type: "minor", number: "9", element: "地・乙女座の金星",
        image: 'assets/images/cards/disks_9_rm.jpg',
        keywords: ["獲得"],
        symbols: []
    },
    {
        id: "cups_prince", name: "Prince の カップ (Prince of Cups)", type: "minor", number: "prince", element: "水の風",
        image: 'assets/images/cards/cups_prince_rm.jpg',
        keywords: ["隠された知性"],
        symbols: []
    },
    {
        id: "wands_knight", name: "Knight の ワンド (Knight of Wands)", type: "minor", number: "knight", element: "火の火",
        image: 'assets/images/cards/wands_knight_rm.jpg',
        keywords: ["情熱と行動力"],
        symbols: []
    },
    {
        id: "wands_6", name: "勝利 (Victory)", type: "minor", number: "6", element: "火・獅子座の木星",
        image: 'assets/images/cards/wands_6_rm.jpg',
        keywords: ["勝利"],
        symbols: []
    },
    {
        id: "cups_5", name: "失望 (Disappointment)", type: "minor", number: "5", element: "水・蠍座の火星",
        image: 'assets/images/cards/cups_5_rm.jpg',
        keywords: ["失望"],
        symbols: []
    },
    {
        id: "swords_5", name: "敗北 (Defeat)", type: "minor", number: "5", element: "風・水瓶座の金星",
        image: 'assets/images/cards/swords_5_rm.jpg',
        keywords: ["敗北"],
        symbols: []
    },
    {
        id: "cups_queen", name: "Queen の カップ (Queen of Cups)", type: "minor", number: "queen", element: "水の水",
        image: 'assets/images/cards/cups_queen_rm.jpg',
        keywords: ["深い感情と思いやる"],
        symbols: []
    },
    {
        id: "wands_princess", name: "Princess の ワンド (Princess of Wands)", type: "minor", number: "princess", element: "火の地",
        image: 'assets/images/cards/wands_princess_rm.jpg',
        keywords: ["新しい火の芽生え"],
        symbols: []
    },
    {
        id: "swords_1", name: "根源的な風力 (Ace of Swords)", type: "minor", number: "1", element: "風",
        image: 'assets/images/cards/swords_1_rm.jpg',
        keywords: ["根源的な風力"],
        symbols: []
    }
];
const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];
