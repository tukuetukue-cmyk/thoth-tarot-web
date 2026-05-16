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
        name: { en: "Kether", ja: "ケテル", meaning: "王冠" },
        pillar: "middle",
        planet: "Primum Mobile",
        planetJa: "原初の旋回",
        color: { queen: "#FFFFFF" },  // クイーン・スケール（代表色）
        divineName: "אהיה (Eheieh)",
        divineNameJa: "エヘイエ「我は在る」",
        archangel: "メタトロン (Metatron)",
        angelOrder: "聖なる生き物 (Chayoth ha-Qadesh)",
        description: "存在の根源。すべてが流出する究極の一点。「在る」という純粋な意志。",
        position: { x: 50, y: 5 }
    },
    {
        id: "chokmah",
        number: 2,
        name: { en: "Chokmah", ja: "コクマー", meaning: "知恵" },
        pillar: "mercy",
        planet: "Zodiac",
        planetJa: "黄道十二宮",
        color: { queen: "#808080" },
        divineName: "יה (Yah)",
        divineNameJa: "ヤー",
        archangel: "ラツィエル (Raziel)",
        angelOrder: "車輪 (Ophanim)",
        description: "最初の閃き。方向を持たない純粋なエネルギーの噴出。父なる力。",
        position: { x: 80, y: 15 }
    },
    {
        id: "binah",
        number: 3,
        name: { en: "Binah", ja: "ビナー", meaning: "理解" },
        pillar: "severity",
        planet: "Saturn",
        planetJa: "土星",
        color: { queen: "#000000" },
        divineName: "יהוה אלהים (YHVH Elohim)",
        divineNameJa: "ヤハウェ・エロヒム",
        archangel: "ツァフキエル (Tzaphkiel)",
        angelOrder: "座天使 (Aralim)",
        description: "形を与える母。理解と制限により、混沌に構造を与える。大いなる海。",
        position: { x: 20, y: 15 }
    },
    {
        id: "chesed",
        number: 4,
        name: { en: "Chesed", ja: "ケセド", meaning: "慈悲" },
        pillar: "mercy",
        planet: "Jupiter",
        planetJa: "木星",
        color: { queen: "#0000FF" },
        divineName: "אל (El)",
        divineNameJa: "エル「神」",
        archangel: "ツァドキエル (Tzadkiel)",
        angelOrder: "主天使 (Chasmalim)",
        description: "恩寵と拡張。秩序ある慈愛により万物を育む建設的な力。",
        position: { x: 80, y: 35 }
    },
    {
        id: "geburah",
        number: 5,
        name: { en: "Geburah", ja: "ゲブラー", meaning: "峻厳" },
        pillar: "severity",
        planet: "Mars",
        planetJa: "火星",
        color: { queen: "#FF0000" },
        divineName: "אלהים גבור (Elohim Gibor)",
        divineNameJa: "エロヒム・ギボール「万能の神」",
        archangel: "カマエル (Kamael)",
        angelOrder: "熾天使 (Seraphim)",
        description: "裁きと浄化の炎。不要なものを焼き払い、真の強さを鍛え上げる。",
        position: { x: 20, y: 35 }
    },
    {
        id: "tiphareth",
        number: 6,
        name: { en: "Tiphareth", ja: "ティファレト", meaning: "美" },
        pillar: "middle",
        planet: "Sun",
        planetJa: "太陽",
        color: { queen: "#FFD700" },
        divineName: "יהוה אלוה ודעת (YHVH Eloah va-Daath)",
        divineNameJa: "ヤハウェ・エロアー・ヴェ・ダアト",
        archangel: "ラファエル (Raphael)",
        angelOrder: "王 (Melekim)",
        description: "生命の樹の中心。上位と下位を調和させる太陽の如き美と均衡。",
        position: { x: 50, y: 45 }
    },
    {
        id: "netzach",
        number: 7,
        name: { en: "Netzach", ja: "ネツァク", meaning: "勝利" },
        pillar: "mercy",
        planet: "Venus",
        planetJa: "金星",
        color: { queen: "#228B22" },
        divineName: "יהוה צבאות (YHVH Tzabaoth)",
        divineNameJa: "ヤハウェ・ツェバオト「万軍の主」",
        archangel: "ハニエル (Haniel)",
        angelOrder: "神々 (Elohim)",
        description: "本能的な情熱と美の追求。感情の力で創造を駆動する。",
        position: { x: 75, y: 65 }
    },
    {
        id: "hod",
        number: 8,
        name: { en: "Hod", ja: "ホド", meaning: "栄光" },
        pillar: "severity",
        planet: "Mercury",
        planetJa: "水星",
        color: { queen: "#FFA500" },
        divineName: "אלהים צבאות (Elohim Tzabaoth)",
        divineNameJa: "エロヒム・ツェバオト",
        archangel: "ミカエル (Michael)",
        angelOrder: "神の子ら (Bene Elohim)",
        description: "知性と分析。言語と論理で世界を分節し、理解する力。",
        position: { x: 25, y: 65 }
    },
    {
        id: "yesod",
        number: 9,
        name: { en: "Yesod", ja: "イェソド", meaning: "基礎" },
        pillar: "middle",
        planet: "Moon",
        planetJa: "月",
        color: { queen: "#9400D3" },
        divineName: "שדי אל חי (Shaddai El Chai)",
        divineNameJa: "シャダイ・エル・カイ「全能の生ける神」",
        archangel: "ガブリエル (Gabriel)",
        angelOrder: "ケルビム (Kerubim)",
        description: "アストラル界の基盤。夢と無意識が物質世界へ投影される門。",
        position: { x: 50, y: 75 }
    },
    {
        id: "malkuth",
        number: 10,
        name: { en: "Malkuth", ja: "マルクト", meaning: "王国" },
        pillar: "middle",
        planet: "Earth",
        planetJa: "地球",
        color: { queen: "#808000" },
        divineName: "אדני הארץ (Adonai ha-Aretz)",
        divineNameJa: "アドナイ・ハ＝アレツ「大地の主」",
        archangel: "サンダルフォン (Sandalphon)",
        angelOrder: "人間の魂 (Ashim)",
        description: "物質世界。すべての力が最終的に顕現する場所。私たちの現実。",
        position: { x: 50, y: 95 }
    }
];

// ダアト（隠されたセフィラ）── セフィラには数えないが表示上は存在する
const DAATH = {
    id: "daath",
    number: null,
    name: { en: "Da'ath", ja: "ダアト", meaning: "知識" },
    pillar: "middle",
    isHidden: true,
    description: "深淵の向こう側にある「知識」。セフィラではなく、上位三角形と下位七セフィラの間の裂け目。",
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
    { number: 11, from: "kether",    to: "chokmah",   hebrew: "א", hebrewName: "Aleph",  hebrewMeaning: "雄牛",   cardId: "fool",        astrological: "風" },
    { number: 12, from: "kether",    to: "binah",     hebrew: "ב", hebrewName: "Beth",   hebrewMeaning: "家",     cardId: "magus",       astrological: "水星" },
    { number: 13, from: "kether",    to: "tiphareth", hebrew: "ג", hebrewName: "Gimel",  hebrewMeaning: "駱駝",   cardId: "priestess",   astrological: "月" },
    { number: 14, from: "chokmah",   to: "binah",     hebrew: "ד", hebrewName: "Daleth", hebrewMeaning: "扉",     cardId: "empress",     astrological: "金星" },
    { number: 15, from: "chokmah",   to: "tiphareth", hebrew: "ה", hebrewName: "He",     hebrewMeaning: "窓",     cardId: "star",        astrological: "水瓶座" },
    { number: 16, from: "chokmah",   to: "chesed",    hebrew: "ו", hebrewName: "Vav",    hebrewMeaning: "釘",     cardId: "hierophant",  astrological: "牡牛座" },
    // --- 深淵を跨ぐ ---
    { number: 17, from: "binah",     to: "tiphareth", hebrew: "ז", hebrewName: "Zain",   hebrewMeaning: "剣",     cardId: "lovers",      astrological: "双子座" },
    { number: 18, from: "binah",     to: "geburah",   hebrew: "ח", hebrewName: "Cheth",  hebrewMeaning: "柵",     cardId: "chariot",     astrological: "蟹座" },
    // --- 深淵より下 ---
    { number: 19, from: "chesed",    to: "geburah",   hebrew: "ט", hebrewName: "Teth",   hebrewMeaning: "蛇",     cardId: "lust",        astrological: "獅子座" },
    { number: 20, from: "chesed",    to: "tiphareth", hebrew: "י", hebrewName: "Yod",    hebrewMeaning: "手",     cardId: "hermit",      astrological: "乙女座" },
    { number: 21, from: "chesed",    to: "netzach",   hebrew: "כ", hebrewName: "Kaph",   hebrewMeaning: "掌",     cardId: "fortune",     astrological: "木星" },
    { number: 22, from: "geburah",   to: "tiphareth", hebrew: "ל", hebrewName: "Lamed",  hebrewMeaning: "牛突棒", cardId: "adjustment",  astrological: "天秤座" },
    { number: 23, from: "geburah",   to: "hod",       hebrew: "מ", hebrewName: "Mem",    hebrewMeaning: "水",     cardId: "hanged-man",  astrological: "水" },
    { number: 24, from: "tiphareth", to: "netzach",   hebrew: "נ", hebrewName: "Nun",    hebrewMeaning: "魚",     cardId: "death",       astrological: "蠍座" },
    { number: 25, from: "tiphareth", to: "yesod",     hebrew: "ס", hebrewName: "Samekh", hebrewMeaning: "支柱",   cardId: "art",         astrological: "射手座" },
    { number: 26, from: "tiphareth", to: "hod",       hebrew: "ע", hebrewName: "Ayin",   hebrewMeaning: "目",     cardId: "devil",       astrological: "山羊座" },
    { number: 27, from: "netzach",   to: "hod",       hebrew: "פ", hebrewName: "Pe",     hebrewMeaning: "口",     cardId: "tower",       astrological: "火星" },
    { number: 28, from: "netzach",   to: "yesod",     hebrew: "צ", hebrewName: "Tzaddi", hebrewMeaning: "釣針",   cardId: "emperor",     astrological: "牡羊座" },
    { number: 29, from: "netzach",   to: "malkuth",   hebrew: "ק", hebrewName: "Qoph",   hebrewMeaning: "後頭部", cardId: "moon",        astrological: "魚座" },
    { number: 30, from: "hod",       to: "yesod",     hebrew: "ר", hebrewName: "Resh",   hebrewMeaning: "頭",     cardId: "sun",         astrological: "太陽" },
    { number: 31, from: "hod",       to: "malkuth",   hebrew: "ש", hebrewName: "Shin",   hebrewMeaning: "歯",     cardId: "aeon",        astrological: "火" },
    { number: 32, from: "yesod",     to: "malkuth",   hebrew: "ת", hebrewName: "Tav",    hebrewMeaning: "十字",   cardId: "universe",    astrological: "土星" }
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
    return ALL_CARDS.find(c => c.id === path.cardId) || null;
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
        card: ALL_CARDS.find(c => c.id === path.cardId) || null
    }));

    return { pip, court, majorPaths };
}

/**
 * スート名からワールド情報を取得
 */
function getWorldForSuit(suitPrefix) {
    return Object.values(FOUR_WORLDS).find(w => w.suit === suitPrefix) || null;
}
