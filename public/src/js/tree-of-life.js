// ====================================================
// 生命の樹｜Tree of Life データ定義
// セフィラ・パス・カード対応マップ
// ALL_CARDS は cards.js で定義済み

// ====================================================
// 1. セフィラ（10の球 + ダアト）
// ====================================================
const SEPHIROTH = [
    {
        id: "kether",
        number: 1,
        name: { en: "Kether", ja: "ケテル", meaning: "王冠", meaning_en: "Crown" },
        pillar: "middle",
        planet: "Primum Mobile",
        planetJa: "原初の旋回",
        color: { queen: "#FFFFFF" },
        divineName: "אהיה (Eheieh)",
        divineNameJa: "エヘイエ「我は在る」",
        archangel: "メタトロン (Metatron)",
        archangelEn: "Metatron",
        angelOrder: "聖なる生き物 (Chayoth ha-Qadesh)",
        angelOrderEn: "Chayoth ha-Qadesh",
        description: "存在の根源。すべてが流出する究極の一点。「在る」という純粋な意志。", desc_en: "The source of existence. The ultimate point from which all emanates. The pure will 'to be'.",
        inquiry: "あなたが本当に成し遂げたいと願う「純粋な意志」は何ですか？", inquiry_en: "What is the 'pure will' that you truly wish to accomplish?",
        position: { x: 50, y: 5 }
    },
    {
        id: "chokmah",
        number: 2,
        name: { en: "Chokmah", ja: "コクマー", meaning: "知恵", meaning_en: "Wisdom" },
        pillar: "mercy",
        planet: "Zodiac",
        planetJa: "黄道十二宮",
        color: { queen: "#808080" },
        divineName: "יה (Yah)",
        divineNameJa: "ヤー",
        archangel: "ラツィエル (Raziel)",
        archangelEn: "Raziel",
        angelOrder: "車輪 (Ophanim)",
        angelOrderEn: "Ophanim",
        description: "最初の閃き。方向を持たない純粋なエネルギーの噴出。父なる力。", desc_en: "The first flash. The eruption of pure, undirected energy. The paternal force.",
        inquiry: "今、あなたの内側から湧き上がっている抑えきれない衝動は何ですか？", inquiry_en: "What uncontrollable urge is welling up from within you right now?",
        position: { x: 80, y: 15 }
    },
    {
        id: "binah",
        number: 3,
        name: { en: "Binah", ja: "ビナー", meaning: "理解", meaning_en: "Understanding" },
        pillar: "severity",
        planet: "Saturn",
        planetJa: "土星",
        color: { queen: "#4A4A5A" }, // UI上の視認性を高めるため、純黒ではなくダークグレー・インディゴ系に変更
        divineName: "יהוה אלהים (YHVH Elohim)",
        divineNameJa: "ヤハウェ・エロヒム",
        archangel: "ツァフキエル (Tzaphkiel)",
        archangelEn: "Tzaphkiel",
        angelOrder: "座天使 (Aralim)",
        angelOrderEn: "Aralim",
        description: "形を与える母。理解と制限により、混沌に構造を与える。大いなる海。", desc_en: "The mother who gives form. Giving structure to chaos through understanding and restriction. The great sea.",
        inquiry: "形にするために、あなたが今受け入れ、制限すべきものは何ですか？", inquiry_en: "To give it form, what must you accept and limit right now?",
        position: { x: 20, y: 15 }
    },
    {
        id: "chesed",
        number: 4,
        name: { en: "Chesed", ja: "ケセド", meaning: "慈悲", meaning_en: "Mercy" },
        pillar: "mercy",
        planet: "Jupiter",
        planetJa: "木星",
        color: { queen: "#0000FF" },
        divineName: "אל (El)",
        divineNameJa: "エル「神」",
        archangel: "ツァドキエル (Tzadkiel)",
        archangelEn: "Tzadkiel",
        angelOrder: "主天使 (Chasmalim)",
        angelOrderEn: "Chasmalim",
        description: "恩寵と拡張。秩序ある慈愛により万物を育む建設的な力。", desc_en: "Grace and expansion. A constructive force that nurtures all things through orderly benevolence.",
        inquiry: "あなたが今、最も自分を許し、豊かさを広げるべき領域はどこですか？", inquiry_en: "In what area must you forgive yourself the most and expand your abundance?",
        position: { x: 80, y: 35 }
    },
    {
        id: "geburah",
        number: 5,
        name: { en: "Geburah", ja: "ゲブラー", meaning: "峻厳", meaning_en: "Severity" },
        pillar: "severity",
        planet: "Mars",
        planetJa: "火星",
        color: { queen: "#FF0000" },
        divineName: "אלהים גבור (Elohim Gibor)",
        divineNameJa: "エロヒム・ギボール「万能の神」",
        archangel: "カマエル (Kamael)",
        archangelEn: "Kamael",
        angelOrder: "熾天使 (Seraphim)",
        angelOrderEn: "Seraphim",
        description: "裁きと浄化の炎。不要なものを焼き払い、真の強さを鍛え上げる。", desc_en: "The flame of judgment and purification. Burning away the unnecessary, forging true strength.",
        inquiry: "真の強さを得るために、今あなたが断ち切るべきものは何ですか？", inquiry_en: "To gain true strength, what must you sever right now?",
        position: { x: 20, y: 35 }
    },
    {
        id: "tiphareth",
        number: 6,
        name: { en: "Tiphareth", ja: "ティファレト", meaning: "美", meaning_en: "Beauty" },
        pillar: "middle",
        planet: "Sun",
        planetJa: "太陽",
        color: { queen: "#FFD700" },
        divineName: "יהוה אלוה ודעת (YHVH Eloah va-Daath)",
        divineNameJa: "ヤハウェ・エロアー・ヴェ・ダアト",
        archangel: "ラファエル (Raphael)",
        archangelEn: "Raphael",
        angelOrder: "王 (Melekim)",
        angelOrderEn: "Melekim",
        description: "生命の樹の中心。上位と下位を調和させる太陽の如き美と均衡。", desc_en: "The center of the Tree of Life. A sun-like beauty and equilibrium that harmonizes the higher and lower.",
        inquiry: "あなたの内なる光と陰が調和したとき、世界にはどんな「美」がもたらされますか？", inquiry_en: "When your inner light and shadow harmonize, what kind of 'beauty' is brought into the world?",
        position: { x: 50, y: 45 }
    },
    {
        id: "netzach",
        number: 7,
        name: { en: "Netzach", ja: "ネツァク", meaning: "勝利", meaning_en: "Victory" },
        pillar: "mercy",
        planet: "Venus",
        planetJa: "金星",
        color: { queen: "#00FF00" },
        divineName: "יהוה צבאות (YHVH Tzabaoth)",
        divineNameJa: "ヤハウェ・ツァバオト「万軍の神」",
        archangel: "ハニエル (Haniel)",
        archangelEn: "Haniel",
        angelOrder: "権天使 (Elohim)",
        angelOrderEn: "Elohim",
        description: "感情、芸術、情熱。本能的な欲求と美的な喜びを生み出す豊かなエネルギー。", desc_en: "Emotion, art, passion. A rich energy that generates instinctive desires and aesthetic joy.",
        inquiry: "論理を超えて、あなたの心が心底求めている喜びは何ですか？", inquiry_en: "Beyond logic, what joy does your heart truly seek?",
        position: { x: 80, y: 60 }
    },
    {
        id: "hod",
        number: 8,
        name: { en: "Hod", ja: "ホド", meaning: "栄光", meaning_en: "Splendor" },
        pillar: "severity",
        planet: "Mercury",
        planetJa: "水星",
        color: { queen: "#FFA500" },
        divineName: "אלהים צבאות (Elohim Tzabaoth)",
        divineNameJa: "エロヒム・ツァバオト「万軍の神」",
        archangel: "ミカエル (Michael)",
        archangelEn: "Michael",
        angelOrder: "大天使 (Beni Elohim)",
        angelOrderEn: "Beni Elohim",
        description: "知性、コミュニケーション、論理。流動するエネルギーを思考によって型に流し込む。", desc_en: "Intellect, communication, logic. Pouring fluid energy into molds through thought.",
        inquiry: "あふれる感情を現実に活かすために、どんな「思考の型」が必要ですか？", inquiry_en: "To utilize your overflowing emotions in reality, what 'mold of thought' is necessary?",
        position: { x: 20, y: 60 }
    },
    {
        id: "yesod",
        number: 9,
        name: { en: "Yesod", ja: "イェソド", meaning: "基礎", meaning_en: "Foundation" },
        pillar: "middle",
        planet: "Moon",
        planetJa: "月",
        color: { queen: "#9400D3" },
        divineName: "שדי אל חי (Shaddai El Chai)",
        divineNameJa: "シャダイ・エル・カイ「全能の生ける神」",
        archangel: "ガブリエル (Gabriel)",
        archangelEn: "Gabriel",
        angelOrder: "ケルビム (Kerubim)",
        angelOrderEn: "Kerubim",
        description: "アストラル界の基盤。夢と無意識が物質世界へ投影される門。", desc_en: "The foundation of the astral plane. The gate through which dreams and the unconscious are projected into the material world.",
        inquiry: "あなたの無意識の底で、まだ目覚めを待っている可能性は何ですか？", inquiry_en: "At the bottom of your unconscious, what possibility is still waiting to awaken?",
        position: { x: 50, y: 75 }
    },
    {
        id: "malkuth",
        number: 10,
        name: { en: "Malkuth", ja: "マルクト", meaning: "王国", meaning_en: "Kingdom" },
        pillar: "middle",
        planet: "Earth",
        planetJa: "地球",
        color: { queen: "#808000" },
        divineName: "אדני הארץ (Adonai ha-Aretz)",
        divineNameJa: "アドナイ・ハ＝アレツ「大地の主」",
        archangel: "サンダルフォン (Sandalphon)",
        angelOrder: "人間の魂 (Ashim)",
        description: "物質世界。すべての力が最終的に顕現する場所。私たちの現実。", desc_en: "The material world. The place where all forces ultimately manifest. Our reality.",
        inquiry: "ここまでのすべての気づきを、今日「現実の行動」としてどう生かしますか？", inquiry_en: "How will you apply all the realizations so far as 'practical action' today?",
        position: { x: 50, y: 95 }
    }
];

// ダアト（隠されたセフィラ）── セフィラには数えないが表示上は存在する
const DAATH = {
    id: "daath",
    number: null,
    name: { en: "Da'ath", ja: "ダアト", meaning: "知識", meaning_en: "Knowledge" },
    pillar: "middle",
    isHidden: true,
    description: "深淵の向こう側にある「知識」。セフィラではなく、上位三角形と下位七セフィラの間の裂け目。", desc_en: "'Knowledge' across the Abyss. Not a Sephira, but the rift between the supernal triangle and the lower seven Sephiroth.",
    inquiry: "あなたが直視することを恐れている、あなた自身の「隠された真実」は何ですか？", inquiry_en: "What is your own 'hidden truth' that you are afraid to face directly?",
    position: { x: 50, y: 25 }
};


// ====================================================
// 2. 三柱（ピラー）定義
// ====================================================
const PILLARS = {
    severity: {
        name: { en: "Pillar of Severity", ja: "峻厳の柱" },
        side: "left",
        sephiroth: ["binah", "geburah", "hod"],
        quality: "収縮・制限・形式"
    },
    middle: {
        name: { en: "Middle Pillar", ja: "均衡の柱" },
        side: "center",
        sephiroth: ["kether", "tiphareth", "yesod", "malkuth"],
        quality: "調和・統合・意識"
    },
    mercy: {
        name: { en: "Pillar of Mercy", ja: "慈悲の柱" },
        side: "right",
        sephiroth: ["chokmah", "chesed", "netzach"],
        quality: "拡張・恩寵・流出"
    }
};


// ====================================================
// 3. 四世界（オーラム）定義
// ====================================================
const FOUR_WORLDS = {
    atziluth: {
        name: { en: "Atziluth", ja: "アツィルト", meaning: "流出界" },
        suit: "wands",
        element: "Fire",
        elementJa: "火",
        quality: "原型・神的意志"
    },
    briah: {
        name: { en: "Briah", ja: "ブリアー", meaning: "創造界" },
        suit: "cups",
        element: "Water",
        elementJa: "水",
        quality: "創造・大天使"
    },
    yetzirah: {
        name: { en: "Yetzirah", ja: "イェツィラー", meaning: "形成界" },
        suit: "swords",
        element: "Air",
        elementJa: "風",
        quality: "形成・天使"
    },
    assiah: {
        name: { en: "Assiah", ja: "アッシャー", meaning: "物質界" },
        suit: "disks",
        element: "Earth",
        elementJa: "地",
        quality: "物質・行動"
    }
};


// ====================================================
// 4. パス（22の小径）── 大アルカナ対応
// ====================================================
// ※ クロウリーの「ツァディはスターにあらず」の入替を反映済み
//    皇帝 = ツァディ (Path 28), 星 = ヘー (Path 15)
const PATHS = [
    // --- 深淵より上 ---
    { number: 11, from: "kether",    to: "chokmah",   hebrew: "א", hebrewName: "Aleph",  hebrewMeaning: "雄牛", hebrewMeaning_en: "Ox",   cardId: "fool",        astrological: "風", astrological_en: "Air", inquiry: "未知なるものへ飛び込むために、あなたが手放すべき「常識」は何ですか？", inquiry_en: "To dive into the unknown, what 'common sense' must you let go of?" },
    { number: 12, from: "kether",    to: "binah",     hebrew: "ב", hebrewName: "Beth",   hebrewMeaning: "家", hebrewMeaning_en: "House",     cardId: "magus",       astrological: "水星", astrological_en: "Mercury", inquiry: "あなたに与えられた才能を、どう現実に形づくりますか？", inquiry_en: "How will you give form to your given talents in reality?" },
    { number: 13, from: "kether",    to: "tiphareth", hebrew: "ג", hebrewName: "Gimel",  hebrewMeaning: "駱駝", hebrewMeaning_en: "Camel",   cardId: "priestess",   astrological: "月", astrological_en: "Moon", inquiry: "静寂の中で、あなたの内なる声は何を語りかけていますか？", inquiry_en: "In the silence, what is your inner voice telling you?" },
    { number: 14, from: "chokmah",   to: "binah",     hebrew: "ד", hebrewName: "Daleth", hebrewMeaning: "扉", hebrewMeaning_en: "Door",     cardId: "empress",     astrological: "金星", astrological_en: "Venus", inquiry: "あなたが今、豊かに育み、愛を注ぐべき対象は何ですか？", inquiry_en: "What should you richly nurture and pour your love into right now?" },
    { number: 15, from: "chokmah",   to: "tiphareth", hebrew: "ה", hebrewName: "He",     hebrewMeaning: "窓", hebrewMeaning_en: "Window",     cardId: "star",        astrological: "水瓶座", astrological_en: "Aquarius", inquiry: "絶望の先に、あなたが希望を見出している「星」は何ですか？", inquiry_en: "Beyond despair, what 'star' do you find hope in?" },
    { number: 16, from: "chokmah",   to: "chesed",    hebrew: "ו", hebrewName: "Vav",    hebrewMeaning: "釘", hebrewMeaning_en: "Nail",     cardId: "hierophant",  astrological: "牡牛座", astrological_en: "Taurus", inquiry: "あなたが頑なに守り続けている「信念」は、本当にあなた自身のものですか？", inquiry_en: "Is the 'belief' you stubbornly hold onto truly your own?" },
    // --- 深淵を跨ぐ ---
    { number: 17, from: "binah",     to: "tiphareth", hebrew: "ז", hebrewName: "Zain",   hebrewMeaning: "剣", hebrewMeaning_en: "Sword",     cardId: "lovers",      astrological: "双子座", astrological_en: "Gemini", inquiry: "今のあなたが統合すべき「相反する二つのもの」は何ですか？", inquiry_en: "What 'two opposing things' must you integrate right now?" },
    { number: 18, from: "binah",     to: "geburah",   hebrew: "ח", hebrewName: "Cheth",  hebrewMeaning: "柵", hebrewMeaning_en: "Fence",     cardId: "chariot",     astrological: "蟹座", astrological_en: "Cancer", inquiry: "あなたの人生の「戦車」を前進させるための明確な目的地はどこですか？", inquiry_en: "Where is the clear destination to drive the 'chariot' of your life forward?" },
    // --- 深淵より下 ---
    { number: 19, from: "chesed",    to: "geburah",   hebrew: "ט", hebrewName: "Teth",   hebrewMeaning: "蛇", hebrewMeaning_en: "Serpent",     cardId: "lust",        astrological: "獅子座", astrological_en: "Leo", inquiry: "あなたの中に眠る「野性的な情熱」を、どう飼い慣らし、力に変えますか？", inquiry_en: "How will you tame and transform the 'wild passion' sleeping within you into power?" },
    { number: 20, from: "chesed",    to: "tiphareth", hebrew: "י", hebrewName: "Yod",    hebrewMeaning: "手", hebrewMeaning_en: "Hand",     cardId: "hermit",      astrological: "乙女座", astrological_en: "Virgo", inquiry: "他者の声から離れ、自分一人の光を見つめる時間を持てていますか？", inquiry_en: "Are you taking the time to distance yourself from the voices of others and gaze at your own solitary light?" },
    { number: 21, from: "chesed",    to: "netzach",   hebrew: "כ", hebrewName: "Kaph",   hebrewMeaning: "掌", hebrewMeaning_en: "Palm",     cardId: "fortune",     astrological: "木星", astrological_en: "Jupiter", inquiry: "コントロールできない運命の輪の中で、あなたが自らの意志で選べることは何ですか？", inquiry_en: "Within the uncontrollable wheel of fortune, what can you choose of your own free will?" },
    { number: 22, from: "geburah",   to: "tiphareth", hebrew: "ל", hebrewName: "Lamed",  hebrewMeaning: "牛突棒", hebrewMeaning_en: "Ox Goad", cardId: "adjustment",  astrological: "天秤座", astrological_en: "Libra", inquiry: "あなたの人生において、今もっとも「バランス」を必要としている領域はどこですか？", inquiry_en: "In your life, what area most requires 'balance' right now?" },
    { number: 23, from: "geburah",   to: "hod",       hebrew: "מ", hebrewName: "Mem",    hebrewMeaning: "水", hebrewMeaning_en: "Water",     cardId: "hanged-man",  astrological: "水", astrological_en: "Water", inquiry: "視点を変えるために、あなたが今「あえて身を委ねるべきこと」は何ですか？", inquiry_en: "To change your perspective, what must you 'deliberately surrender to' right now?" },
    { number: 24, from: "tiphareth", to: "netzach",   hebrew: "נ", hebrewName: "Nun",    hebrewMeaning: "魚", hebrewMeaning_en: "Fish",     cardId: "death",       astrological: "蠍座", astrological_en: "Scorpio", inquiry: "新しく生まれ変わるために、あなたが今終わらせるべきものは何ですか？", inquiry_en: "To be reborn anew, what must you bring to an end right now?" },
    { number: 25, from: "tiphareth", to: "yesod",     hebrew: "ס", hebrewName: "Samekh", hebrewMeaning: "支柱", hebrewMeaning_en: "Prop",   cardId: "art",         astrological: "射手座", astrological_en: "Sagittarius", inquiry: "相反する要素を混ぜ合わせることで、どんな「新しいあなた」が創造されますか？", inquiry_en: "By blending opposing elements, what 'new you' will be created?" },
    { number: 26, from: "tiphareth", to: "hod",       hebrew: "ע", hebrewName: "Ayin",   hebrewMeaning: "目", hebrewMeaning_en: "Eye",     cardId: "devil",       astrological: "山羊座", astrological_en: "Capricorn", inquiry: "あなたを縛り付けている「物質的な執着」や「見えない鎖」の正体は何ですか？", inquiry_en: "What is the true nature of the 'material attachments' or 'invisible chains' binding you?" },
    { number: 27, from: "netzach",   to: "hod",       hebrew: "פ", hebrewName: "Pe",     hebrewMeaning: "口", hebrewMeaning_en: "Mouth",     cardId: "tower",       astrological: "火星", astrological_en: "Mars", inquiry: "あなたの古い価値観が崩れ去った後、そこにはどんな真実が残りますか？", inquiry_en: "After your old values crumble away, what truth remains there?" },
    { number: 28, from: "netzach",   to: "yesod",     hebrew: "צ", hebrewName: "Tzaddi", hebrewMeaning: "釣針", hebrewMeaning_en: "Fishhook",   cardId: "emperor",     astrological: "牡羊座", astrological_en: "Aries", inquiry: "あなたの世界に秩序をもたらすために、今どのようなリーダーシップが必要ですか？", inquiry_en: "To bring order to your world, what kind of leadership is needed right now?" },
    { number: 29, from: "netzach",   to: "malkuth",   hebrew: "ק", hebrewName: "Qoph",   hebrewMeaning: "後頭部", hebrewMeaning_en: "Back of Head", cardId: "moon",        astrological: "魚座", astrological_en: "Pisces", inquiry: "暗闇の中であなたを惑わす「幻想」や「恐怖」は、本当は何を教えていますか？", inquiry_en: "What are the 'illusions' or 'fears' confusing you in the dark truly trying to teach you?" },
    { number: 30, from: "hod",       to: "yesod",     hebrew: "ר", hebrewName: "Resh",   hebrewMeaning: "頭", hebrewMeaning_en: "Head",     cardId: "sun",         astrological: "太陽", astrological_en: "Sun", inquiry: "あなたが最も純粋に「生かされている」と感じる瞬間はどんな時ですか？", inquiry_en: "When are the moments you feel most purely 'alive'?" },
    { number: 31, from: "hod",       to: "malkuth",   hebrew: "ש", hebrewName: "Shin",   hebrewMeaning: "歯", hebrewMeaning_en: "Tooth",     cardId: "aeon",        astrological: "火", astrological_en: "Fire", inquiry: "古い時代が終わり、あなたが今から歩み出す「新しい時代」とはどんなものですか？", inquiry_en: "As the old era ends, what is this 'new era' you are stepping into?" },
    { number: 32, from: "yesod",     to: "malkuth",   hebrew: "ת", hebrewName: "Tav",    hebrewMeaning: "十字", hebrewMeaning_en: "Cross",   cardId: "universe",    astrological: "土星", astrological_en: "Saturn", inquiry: "あなたが今完成させ、そして次なる次元へと昇華させるべきテーマは何ですか？", inquiry_en: "What is the theme you must now complete and elevate to the next dimension?" }
];


// ====================================================
// 5. コートカード → セフィラ対応
// ====================================================
const COURT_RANK_MAP = {
    knight:   { sephiraId: "chokmah",   elementQuality: "火", descJa: "スートの火の力" },
    queen:    { sephiraId: "binah",     elementQuality: "水", descJa: "スートの水の力" },
    prince:   { sephiraId: "tiphareth", elementQuality: "風", descJa: "スートの風の力" },
    princess: { sephiraId: "malkuth",   elementQuality: "地", descJa: "スートの地の力" }
};


// ====================================================
// 6. ユーティリティ関数
// ====================================================

/**
 * セフィラIDからセフィラオブジェクトを取得
 */
function getSephira(sephiraId) {
    return SEPHIROTH.find(s => s.id === sephiraId) || null;
}

/**
 * セフィラ番号からセフィラオブジェクトを取得
 */
function getSephiraByNumber(num) {
    return SEPHIROTH.find(s => s.number === num) || null;
}

/**
 * パス番号に対応する大アルカナカードを取得
 * （cards.js の ALL_CARDS に依存）
 */
function getCardForPath(pathNumber) {
    const path = PATHS.find(p => p.number === pathNumber);
    if (!path) return null;
    return (window.ALL_CARDS || [...MAJOR_ARCANA, ...MINOR_ARCANA]).find(c => c.id === path.cardId) || null;
}

/**
 * カードIDからパス情報を取得（大アルカナ用）
 */
function getPathForCard(cardId) {
    return PATHS.find(p => p.cardId === cardId) || null;
}

/**
 * セフィラに属する小アルカナ（数札）を全スート取得
 * cards.js の MINOR_ARCANA に依存
 */
function getMinorCardsForSephira(sephiraNumber) {
    return MINOR_ARCANA.filter(card => {
        const num = parseInt(card.number, 10);
        return num === sephiraNumber;
    });
}

/**
 * セフィラに属するコートカードを全スート取得
 */
function getCourtCardsForSephira(sephiraId) {
    const ranks = Object.entries(COURT_RANK_MAP)
        .filter(([, v]) => v.sephiraId === sephiraId)
        .map(([rank]) => rank);

    if (ranks.length === 0) return [];

    return MINOR_ARCANA.filter(card => {
        return ranks.includes(card.number);
    });
}

/**
 * セフィラに関連する全カード（数札＋コート＋大アルカナ経由パス）を取得
 */
function getAllCardsForSephira(sephiraId) {
    const sephira = getSephira(sephiraId);
    if (!sephira) return { pip: [], court: [], majorPaths: [] };

    // 数札（Ace〜10）
    const pip = getMinorCardsForSephira(sephira.number);

    // コートカード
    const court = getCourtCardsForSephira(sephiraId);

    // 大アルカナ（このセフィラを起点・終点とするパス）
    const relatedPaths = PATHS.filter(p => p.from === sephiraId || p.to === sephiraId);
    const majorPaths = relatedPaths.map(path => ({
        path,
        card: (window.ALL_CARDS || [...MAJOR_ARCANA, ...MINOR_ARCANA]).find(c => c.id === path.cardId) || null
    }));

    return { pip, court, majorPaths };
}

/**
 * スート名からワールド情報を取得
 */
function getWorldForSuit(suitPrefix) {
    return Object.values(FOUR_WORLDS).find(w => w.suit === suitPrefix) || null;
}
