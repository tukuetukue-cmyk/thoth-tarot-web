import re

with open('/Users/tukue/.gemini/antigravity/scratch/thoth_tarot_project/thoth-tarot-web/public/src/js/tree-of-life-ui.js', 'r') as f:
    content = f.read()

# Add language initialization at the top of the IIFE
lang_init = """    // --- 言語設定の初期化 ---
    const savedLang = localStorage.getItem('tarot_lang');
    const browserLang = navigator.language || navigator.userLanguage || 'ja';
    window.currentLang = savedLang || (browserLang.startsWith('ja') ? 'ja' : 'en');
    const isEn = window.currentLang === 'en';

"""
content = content.replace('    // --- アクティブ状態の追跡 ---', lang_init + '    // --- アクティブ状態の追跡 ---')

# Add applyI18nToStaticHtml function
i18n_func = """    function applyI18nToStaticHtml() {
        if (!isEn) return;
        document.title = "Sefirot | Tree of Life ── Thoth Tarot";
        const backLink1 = document.querySelector(".tree-header .back-link");
        if (backLink1) backLink1.textContent = "← Back to Reading";
        const treeSubtitle = document.querySelector(".tree-page-subtitle");
        if (treeSubtitle) treeSubtitle.textContent = "Sefirot | Exploration of the Tree of Life";
        const infoHint = document.querySelector(".info-hint");
        if (infoHint) infoHint.textContent = "Touch a Sephira or Path";
        const footerBackLink = document.querySelector(".footer-back-link");
        if (footerBackLink) footerBackLink.textContent = "← Back to Thoth Tarot Reading";
        
        const dictName = document.getElementById("dictionary-card-name");
        if (dictName && dictName.textContent === "カード名") dictName.textContent = "Card Name";
        const dictMeta = document.getElementById("dictionary-card-meta");
        if (dictMeta && dictMeta.textContent === "エレメント / 属性") dictMeta.textContent = "Element / Attribute";
        
        const esotericTitle = document.querySelector(".dictionary-esoteric .dictionary-section-title");
        if (esotericTitle) esotericTitle.textContent = "ESOTERIC ── Occult Correspondences";
        const symbolsTitle = document.querySelector(".dictionary-symbols .dictionary-section-title");
        if (symbolsTitle) symbolsTitle.textContent = "SYMBOLS ── Illustrated Symbols";
    }

"""
content = content.replace('    // ====================================================', i18n_func + '    // ====================================================', 1)

# Call applyI18nToStaticHtml in init
content = content.replace('        initDrawer();', '        initDrawer();\n        applyI18nToStaticHtml();')

# Modify onSephiraClick
sephira_click_old = """    function onSephiraClick(sephira) {
        setActive("sephira", sephira.id);

        const allCards = getAllCardsForSephira(sephira.id);
        const pillarInfo = PILLARS[sephira.pillar];

        let html = `
            <div class="info-sephira-header">
                <span class="info-sephira-number">${sephira.number}</span>
                <span class="info-sephira-name">${sephira.name.en}</span>
            </div>
            <div class="info-sephira-ja">${sephira.name.ja}｜${sephira.name.meaning}</div>
            <hr class="info-divider">
            <p class="info-desc">${sephira.description}</p>
            ${sephira.inquiry ? `
            <div class="info-inquiry">
                <div class="info-inquiry-label">INQUIRY</div>
                <div class="info-inquiry-text">『${sephira.inquiry}』</div>
            </div>
            ` : ''}
            <div class="info-meta-grid">
                <span class="info-meta-label">天体</span>
                <span class="info-meta-value">${sephira.planetJa} (${sephira.planet})</span>
                <span class="info-meta-label">柱</span>
                <span class="info-meta-value">${pillarInfo.name.ja}</span>
                <span class="info-meta-label">神名</span>
                <span class="info-meta-value">${sephira.divineNameJa}</span>
                <span class="info-meta-label">大天使</span>
                <span class="info-meta-value">${sephira.archangel}</span>
                <span class="info-meta-label">天使団</span>
                <span class="info-meta-value">${sephira.angelOrder}</span>
            </div>
        `;

        // 関連する大アルカナ（パス経由）
        if (allCards.majorPaths.length > 0) {
            html += `
                <div class="info-cards-section">
                    <div class="info-cards-title">PATHS ── 大アルカナ</div>
                    <div class="info-card-chips">
                        ${allCards.majorPaths.map(mp =>
                            `<span class="info-card-chip clickable-card-chip" data-card-id="${mp.card ? mp.card.id : ''}" title="第${mp.path.number}のパス / ${mp.path.hebrew} ${mp.path.hebrewName}">${mp.card ? mp.card.name : mp.path.cardId}</span>`
                        ).join("")}
                    </div>
                </div>
            `;
        }

        // 関連する数札
        if (allCards.pip.length > 0) {
            html += `
                <div class="info-cards-section">
                    <div class="info-cards-title">NUMBER ${sephira.number} ── 数札</div>
                    <div class="info-card-chips">
                        ${allCards.pip.map(c =>
                            `<span class="info-card-chip clickable-card-chip" data-card-id="${c.id}">${c.name}</span>`
                        ).join("")}
                    </div>
                </div>
            `;
        }

        // 関連するコートカード
        if (allCards.court.length > 0) {
            html += `
                <div class="info-cards-section">
                    <div class="info-cards-title">COURT ── 宮廷札</div>
                    <div class="info-card-chips">
                        ${allCards.court.map(c =>
                            `<span class="info-card-chip clickable-card-chip" data-card-id="${c.id}">${c.name}</span>`
                        ).join("")}
                    </div>
                </div>
            `;
        }"""

sephira_click_new = """    function onSephiraClick(sephira) {
        setActive("sephira", sephira.id);

        const allCards = getAllCardsForSephira(sephira.id);
        const pillarInfo = PILLARS[sephira.pillar];

        const nameLocal = isEn ? sephira.name.en : sephira.name.ja;
        const meaningLocal = isEn ? (sephira.name.meaning_en || sephira.name.meaning) : sephira.name.meaning;
        const descLocal = isEn ? (sephira.desc_en || sephira.description) : sephira.description;
        const inquiryLocal = isEn ? (sephira.inquiry_en || sephira.inquiry) : sephira.inquiry;
        const planetLocal = isEn ? sephira.planet : sephira.planetJa;
        const pillarLocal = isEn ? pillarInfo.name.en : pillarInfo.name.ja;
        const divineNameLocal = isEn ? sephira.divineName : sephira.divineNameJa;

        let html = `
            <div class="info-sephira-header">
                <span class="info-sephira-number">${sephira.number}</span>
                <span class="info-sephira-name">${sephira.name.en}</span>
            </div>
            <div class="info-sephira-ja">${nameLocal} | ${meaningLocal}</div>
            <hr class="info-divider">
            <p class="info-desc">${descLocal}</p>
            ${inquiryLocal ? `
            <div class="info-inquiry">
                <div class="info-inquiry-label">INQUIRY</div>
                <div class="info-inquiry-text">『${inquiryLocal}』</div>
            </div>
            ` : ''}
            <div class="info-meta-grid">
                <span class="info-meta-label">${isEn ? 'Planet' : '天体'}</span>
                <span class="info-meta-value">${planetLocal}</span>
                <span class="info-meta-label">${isEn ? 'Pillar' : '柱'}</span>
                <span class="info-meta-value">${pillarLocal}</span>
                <span class="info-meta-label">${isEn ? 'God Name' : '神名'}</span>
                <span class="info-meta-value">${divineNameLocal}</span>
                <span class="info-meta-label">${isEn ? 'Archangel' : '大天使'}</span>
                <span class="info-meta-value">${sephira.archangel}</span>
                <span class="info-meta-label">${isEn ? 'Angel Order' : '天使団'}</span>
                <span class="info-meta-value">${sephira.angelOrder}</span>
            </div>
        `;

        if (allCards.majorPaths.length > 0) {
            html += `
                <div class="info-cards-section">
                    <div class="info-cards-title">${isEn ? 'PATHS ── Major Arcana' : 'PATHS ── 大アルカナ'}</div>
                    <div class="info-card-chips">
                        ${allCards.majorPaths.map(mp => {
                            const cardName = mp.card ? (isEn && mp.card.name_en ? mp.card.name_en : mp.card.name) : mp.path.cardId;
                            return `<span class="info-card-chip clickable-card-chip" data-card-id="${mp.card ? mp.card.id : ''}" title="Path ${mp.path.number} / ${mp.path.hebrew} ${mp.path.hebrewName}">${cardName}</span>`;
                        }).join("")}
                    </div>
                </div>
            `;
        }

        if (allCards.pip.length > 0) {
            html += `
                <div class="info-cards-section">
                    <div class="info-cards-title">NUMBER ${sephira.number} ── ${isEn ? 'Minor Arcana' : '数札'}</div>
                    <div class="info-card-chips">
                        ${allCards.pip.map(c => {
                            const cardName = isEn && c.name_en ? c.name_en : c.name;
                            return `<span class="info-card-chip clickable-card-chip" data-card-id="${c.id}">${cardName}</span>`;
                        }).join("")}
                    </div>
                </div>
            `;
        }

        if (allCards.court.length > 0) {
            html += `
                <div class="info-cards-section">
                    <div class="info-cards-title">COURT ── ${isEn ? 'Court Cards' : '宮廷札'}</div>
                    <div class="info-card-chips">
                        ${allCards.court.map(c => {
                            const cardName = isEn && c.name_en ? c.name_en : c.name;
                            return `<span class="info-card-chip clickable-card-chip" data-card-id="${c.id}">${cardName}</span>`;
                        }).join("")}
                    </div>
                </div>
            `;
        }"""
content = content.replace(sephira_click_old, sephira_click_new)

# Modify onPathClick
path_click_old = """    function onPathClick(path) {
        setActive("path", path.number);

        const card = getCardForPath(path.number);
        const fromSephira = getSephira(path.from);
        const toSephira = getSephira(path.to);

        let html = `
            <div class="info-path-header">
                <div class="info-path-number">PATH ${path.number}</div>
            </div>
            <div class="info-hebrew-large">${path.hebrew}</div>
            <div class="info-sephira-ja" style="text-align: center;">
                ${path.hebrewName}｜${path.hebrewMeaning}
            </div>
            <hr class="info-divider">
            ${path.inquiry ? `
            <div class="info-inquiry" style="margin-bottom: 1.5rem;">
                <div class="info-inquiry-label">INQUIRY</div>
                <div class="info-inquiry-text">『${path.inquiry}』</div>
            </div>
            ` : ''}
        `;

        if (card) {
            html += `
                <div class="info-path-card-name clickable-card-chip" data-card-id="${card.id}" style="cursor:pointer; display:inline-block; border-bottom:1px dashed var(--accent-gold); padding-bottom:2px;">${card.name}</div>
                <div class="info-meta-grid" style="margin-top: 1rem;">
                    <span class="info-meta-label">占星対応</span>
                    <span class="info-meta-value">${path.astrological}</span>
                    <span class="info-meta-label">接続</span>
                    <span class="info-meta-value">${fromSephira.name.ja}(${fromSephira.number}) ↔ ${toSephira.name.ja}(${toSephira.number})</span>
                </div>
            `;

            // カードのキーワード
            if (card.keywords && card.keywords.length > 0) {
                html += `
                    <div class="info-cards-section">
                        <div class="info-cards-title">KEYWORDS</div>
                        <div class="info-card-chips">
                            ${card.keywords.map(kw =>
                                `<span class="info-card-chip">${kw}</span>`
                            ).join("")}
                        </div>
                    </div>
                `;
            }
        }"""

path_click_new = """    function onPathClick(path) {
        setActive("path", path.number);

        const card = getCardForPath(path.number);
        const fromSephira = getSephira(path.from);
        const toSephira = getSephira(path.to);

        const inquiryLocal = isEn ? (path.inquiry_en || path.inquiry) : path.inquiry;
        const astroLocal = isEn ? (path.astrological_en || path.astrological) : path.astrological;
        const fromName = isEn ? fromSephira.name.en : fromSephira.name.ja;
        const toName = isEn ? toSephira.name.en : toSephira.name.ja;

        let html = `
            <div class="info-path-header">
                <div class="info-path-number">PATH ${path.number}</div>
            </div>
            <div class="info-hebrew-large">${path.hebrew}</div>
            <div class="info-sephira-ja" style="text-align: center;">
                ${path.hebrewName} | ${path.hebrewMeaning}
            </div>
            <hr class="info-divider">
            ${inquiryLocal ? `
            <div class="info-inquiry" style="margin-bottom: 1.5rem;">
                <div class="info-inquiry-label">INQUIRY</div>
                <div class="info-inquiry-text">『${inquiryLocal}』</div>
            </div>
            ` : ''}
        `;

        if (card) {
            const cardName = isEn && card.name_en ? card.name_en : card.name;
            html += `
                <div class="info-path-card-name clickable-card-chip" data-card-id="${card.id}" style="cursor:pointer; display:inline-block; border-bottom:1px dashed var(--accent-gold); padding-bottom:2px;">${cardName}</div>
                <div class="info-meta-grid" style="margin-top: 1rem;">
                    <span class="info-meta-label">${isEn ? 'Astrology' : '占星対応'}</span>
                    <span class="info-meta-value">${astroLocal}</span>
                    <span class="info-meta-label">${isEn ? 'Connection' : '接続'}</span>
                    <span class="info-meta-value">${fromName}(${fromSephira.number}) ↔ ${toName}(${toSephira.number})</span>
                </div>
            `;

            const keywords = isEn && card.keywords_en && card.keywords_en.length > 0 ? card.keywords_en : card.keywords;
            if (keywords && keywords.length > 0) {
                html += `
                    <div class="info-cards-section">
                        <div class="info-cards-title">KEYWORDS</div>
                        <div class="info-card-chips">
                            ${keywords.map(kw =>
                                `<span class="info-card-chip">${kw}</span>`
                            ).join("")}
                        </div>
                    </div>
                `;
            }
        }"""
content = content.replace(path_click_old, path_click_new)

# Modify onDaathClick
daath_click_old = """    function onDaathClick() {
        setActive("sephira", "daath");

        const html = `
            <div class="info-sephira-header">
                <span class="info-sephira-number" style="opacity: 0.2;">∅</span>
                <span class="info-sephira-name">Da'ath</span>
            </div>
            <div class="info-sephira-ja">ダアト｜知識</div>
            <hr class="info-divider">
            <p class="info-desc">${DAATH.description}</p>
            ${DAATH.inquiry ? `
            <div class="info-inquiry">
                <div class="info-inquiry-label">INQUIRY</div>
                <div class="info-inquiry-text">『${DAATH.inquiry}』</div>
            </div>
            ` : ''}
            <p class="info-desc" style="opacity: 0.6; font-size: 0.85rem;">
                ダアトは正式なセフィラには数えられない。深淵（Abyss）の只中に位置し、上位の三項（至高の三角形）と下位の七セフィラの間の裂け目を象徴する。<br><br>
                ここを越えることは、エゴの完全な消滅を意味する。
            </p>
        `;

        showInfoPanel(html);
    }"""

daath_click_new = """    function onDaathClick() {
        setActive("sephira", "daath");

        const inquiryLocal = isEn ? (DAATH.inquiry_en || DAATH.inquiry) : DAATH.inquiry;
        const descLocal = isEn ? (DAATH.desc_en || DAATH.description) : DAATH.description;
        const extraDescLocal = isEn 
            ? "Da'ath is not officially counted as a Sephira. Located in the midst of the Abyss, it symbolizes the rift between the upper triad (the Supernal Triangle) and the lower seven Sephiroth.<br><br>Crossing this point signifies the complete annihilation of the ego."
            : "ダアトは正式なセフィラには数えられない。深淵（Abyss）の只中に位置し、上位の三項（至高の三角形）と下位の七セフィラの間の裂け目を象徴する。<br><br>ここを越えることは、エゴの完全な消滅を意味する。";

        const html = `
            <div class="info-sephira-header">
                <span class="info-sephira-number" style="opacity: 0.2;">∅</span>
                <span class="info-sephira-name">Da'ath</span>
            </div>
            <div class="info-sephira-ja">${isEn ? "Da'ath | Knowledge" : "ダアト｜知識"}</div>
            <hr class="info-divider">
            <p class="info-desc">${descLocal}</p>
            ${inquiryLocal ? `
            <div class="info-inquiry">
                <div class="info-inquiry-label">INQUIRY</div>
                <div class="info-inquiry-text">『${inquiryLocal}』</div>
            </div>
            ` : ''}
            <p class="info-desc" style="opacity: 0.6; font-size: 0.85rem;">
                ${extraDescLocal}
            </p>
        `;

        showInfoPanel(html);
    }"""
content = content.replace(daath_click_old, daath_click_new)

# Modify highlight processing text
highlight_old = """        let highlightHtml = `
            <div style="text-align:center; padding: 1rem 0;">
                <h3 style="color: var(--accent-gold); font-family: var(--font-heading); letter-spacing: 0.1em; margin-bottom: 0.5rem;">YOUR READING</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
                    引いたカードが生命の樹のどこに位置するか、<br>黄金の輝きで示されています。
                </p>
                <div class="info-card-chips" style="justify-content: center; gap: 10px;">
        `;"""
highlight_new = """        let highlightHtml = `
            <div style="text-align:center; padding: 1rem 0;">
                <h3 style="color: var(--accent-gold); font-family: var(--font-heading); letter-spacing: 0.1em; margin-bottom: 0.5rem;">YOUR READING</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
                    ${isEn ? "The positions of the drawn cards on the Tree of Life<br>are indicated by a golden glow." : "引いたカードが生命の樹のどこに位置するか、<br>黄金の輝きで示されています。"}
                </p>
                <div class="info-card-chips" style="justify-content: center; gap: 10px;">
        `;"""
content = content.replace(highlight_old, highlight_new)

# Modify highlight footer text
highlight_footer_old = """        highlightHtml += `
                </div>
                <p style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 1.5rem; opacity: 0.7;">
                    チップに触れるとカード図鑑が開きます。
                </p>
            </div>
        `;"""
highlight_footer_new = """        highlightHtml += `
                </div>
                <p style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 1.5rem; opacity: 0.7;">
                    ${isEn ? "Touch a chip to open the Card Dictionary." : "チップに触れるとカード図鑑が開きます。"}
                </p>
            </div>
        `;"""
content = content.replace(highlight_footer_old, highlight_footer_new)


with open('/Users/tukue/.gemini/antigravity/scratch/thoth_tarot_project/thoth-tarot-web/public/src/js/tree-of-life-ui.js', 'w') as f:
    f.write(content)

