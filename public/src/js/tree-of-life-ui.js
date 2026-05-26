// ====================================================
// 生命の樹｜Tree of Life ── UI描画 & インタラクション
// ====================================================

(function () {
    "use strict";

    // --- 定数 ---
    const SVG_NS = "http://www.w3.org/2000/svg";
    const VIEWBOX_W = 500;
    const VIEWBOX_H = 700;
    const SEPHIRA_R = 40;   // セフィラの半径（大きく）
    const DAATH_R = 26;     // ダアトの半径

    // --- DOM参照 ---
    const svgEl = document.getElementById("tree-svg");
    const pathsLayer = document.getElementById("paths-layer");
    const abyssLayer = document.getElementById("abyss-layer");
    const sephirothLayer = document.getElementById("sephiroth-layer");
    const infoPanel = document.getElementById("info-content");
    const infoPlaceholder = document.getElementById("info-placeholder");
    const treeContainer = document.getElementById("tree-container");
    
    // ドロワー用DOM参照
    const infoPanelElement = document.getElementById("info-panel");

    // --- 言語設定の初期化 ---
    const savedLang = localStorage.getItem('tarot_lang');
    const browserLang = navigator.language || navigator.userLanguage || 'ja';
    window.currentLang = savedLang || (browserLang.startsWith('ja') ? 'ja' : 'en');
    let isEn = window.currentLang === 'en';

    // --- アクティブ状態の追跡 ---
    let activeElement = null; // { type: 'sephira' | 'path' | 'daath', id: string|number }

    function applyI18nToStaticHtml() {
        document.title = isEn ? "Sefirot | Tree of Life ── Thoth Tarot" : "Sefirot｜セフィロト ── トート・タロット";
        const backLink1 = document.querySelector(".tree-header .back-link");
        if (backLink1) backLink1.textContent = isEn ? "← Back to Reading" : "← リーディングに戻る";
        const treeSubtitle = document.querySelector(".tree-page-subtitle");
        if (treeSubtitle) treeSubtitle.textContent = isEn ? "Sefirot | Exploration of the Tree of Life" : "セフィロト｜生命の樹の探索";
        const infoHint = document.querySelector(".info-hint");
        if (infoHint) infoHint.textContent = isEn ? "Touch a Sephira or Path" : "セフィラまたはパスに触れてください";
        const footerBackLink = document.querySelector(".footer-back-link");
        if (footerBackLink) footerBackLink.textContent = isEn ? "← Back to Thoth Tarot Reading" : "← トート・タロット リーディングに戻る";
        
        const dictName = document.getElementById("dictionary-card-name");
        if (dictName) dictName.textContent = isEn ? "Card Name" : "カード名";
        const dictMeta = document.getElementById("dictionary-card-meta");
        if (dictMeta) dictMeta.textContent = isEn ? "Element / Attribute" : "エレメント / 属性";
        
        const esotericTitle = document.querySelector(".dictionary-esoteric .dictionary-section-title");
        if (esotericTitle) esotericTitle.textContent = isEn ? "ESOTERIC ── Occult Correspondences" : "ESOTERIC ── 神秘的対応";
        const symbolsTitle = document.querySelector(".dictionary-symbols .dictionary-section-title");
        if (symbolsTitle) symbolsTitle.textContent = isEn ? "SYMBOLS ── Illustrated Symbols" : "SYMBOLS ── 象徴図解";

        const toggleBtn = document.getElementById('lang-toggle-btn');
        if (toggleBtn) toggleBtn.textContent = isEn ? 'JP' : 'EN';
    }

    function switchLang() {
        window.currentLang = window.currentLang === 'ja' ? 'en' : 'ja';
        isEn = window.currentLang === 'en';
        localStorage.setItem('tarot_lang', window.currentLang);
        applyI18nToStaticHtml();
        // 次にセフィラ/パスをタップしたとき自動的に新しい言語で表示される
    }

    // ====================================================
    // アンビエント（生命の鼓動）エフェクト
    // ====================================================
    let idleTimer = null;
    let ambientTimeout = null;
    let currentAmbientElement = null;
    const IDLE_WAIT_MS = 1000; // 1秒間操作がなければ開始

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        clearTimeout(ambientTimeout);
        
        // 現在光っているものを消す
        if (currentAmbientElement) {
            currentAmbientElement.classList.remove("ambient-glow");
            currentAmbientElement = null;
        }

        // 何かアクティブな状態（パネルが開いている等）なら、アンビエントは開始しない
        if (activeElement !== null) return;

        idleTimer = setTimeout(triggerAmbientGlow, IDLE_WAIT_MS);
    }

    function triggerAmbientGlow() {
        if (activeElement !== null) return;

        if (currentAmbientElement) {
            currentAmbientElement.classList.remove("ambient-glow");
        }

        // セフィラかパスかランダムに選ぶ
        const isSephira = Math.random() > 0.5;
        if (isSephira) {
            const sephiroth = document.querySelectorAll(".sephira-group");
            if (sephiroth.length > 0) {
                const idx = Math.floor(Math.random() * sephiroth.length);
                currentAmbientElement = sephiroth[idx];
            }
        } else {
            const paths = document.querySelectorAll(".tree-path");
            if (paths.length > 0) {
                const idx = Math.floor(Math.random() * paths.length);
                currentAmbientElement = paths[idx];
            }
        }

        if (currentAmbientElement) {
            currentAmbientElement.classList.add("ambient-glow");
        }

        // 光を消すタイミング（長く光らせる）
        setTimeout(() => {
            if (currentAmbientElement) {
                currentAmbientElement.classList.remove("ambient-glow");
                currentAmbientElement = null;
            }
        }, 4000);

        // 次の鼓動までランダムな間隔 (3秒〜6秒後)
        const nextInterval = 3000 + Math.random() * 3000;
        ambientTimeout = setTimeout(triggerAmbientGlow, nextInterval);
    }

    // ====================================================
    // 座標変換ヘルパー
    // ====================================================
    function toSvgCoords(position) {
        return {
            x: (position.x / 100) * VIEWBOX_W,
            y: (position.y / 100) * VIEWBOX_H
        };
    }

    // ====================================================
    // SVG要素生成ヘルパー
    // ====================================================
    function createSvgElement(tag, attrs) {
        const el = document.createElementNS(SVG_NS, tag);
        for (const [key, val] of Object.entries(attrs)) {
            el.setAttribute(key, val);
        }
        return el;
    }

    // ====================================================
    // パス（線）の描画
    // ====================================================
    function drawPaths() {
        PATHS.forEach(path => {
            const fromSephira = getSephira(path.from);
            const toSephira = getSephira(path.to);
            if (!fromSephira || !toSephira) return;

            const from = toSvgCoords(fromSephira.position);
            const to = toSvgCoords(toSephira.position);

            // 線
            const line = createSvgElement("line", {
                x1: from.x, y1: from.y,
                x2: to.x, y2: to.y,
                class: "tree-path",
                "data-path-number": path.number
            });

            line.addEventListener("click", () => onPathClick(path));
            line.addEventListener("mouseenter", () => onPathHover(path, line));
            pathsLayer.appendChild(line);

            // ヘブライ文字ラベル（線の中点）
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            // 線と重ならないよう少しオフセット
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const offsetX = (-dy / len) * 12;
            const offsetY = (dx / len) * 12;

            const label = createSvgElement("text", {
                x: midX + offsetX,
                y: midY + offsetY,
                class: "path-label"
            });
            label.textContent = path.hebrew;
            pathsLayer.appendChild(label);
        });
    }

    // ====================================================
    // 深淵ラインの描画
    // ====================================================
    function drawAbyss() {
        // ダアトのY座標を基準にする
        const daathCoords = toSvgCoords(DAATH.position);
        const abyssY = daathCoords.y + DAATH_R + 15;

        const line = createSvgElement("line", {
            x1: 30, y1: abyssY,
            x2: VIEWBOX_W - 30, y2: abyssY,
            class: "abyss-line"
        });
        abyssLayer.appendChild(line);

        const label = createSvgElement("text", {
            x: VIEWBOX_W / 2,
            y: abyssY - 8,
            class: "abyss-label"
        });
        label.textContent = "THE ABYSS";
        abyssLayer.appendChild(label);
    }

    // ====================================================
    // セフィラ（球）の描画
    // ====================================================
    function drawSephiroth() {
        // 通常の10セフィラ
        SEPHIROTH.forEach(sephira => {
            const coords = toSvgCoords(sephira.position);
            const group = createSvgElement("g", {
                class: "sephira-group",
                "data-sephira-id": sephira.id
            });

            // グロー効果（ホバー時に表示）
            const glow = createSvgElement("circle", {
                cx: coords.x, cy: coords.y, r: SEPHIRA_R + 8,
                class: "sephira-glow",
                fill: "none",
                stroke: "var(--accent-gold)", // 同色（ゴールド）に統一
                "stroke-width": "1",
                opacity: "0.3"
            });
            group.appendChild(glow);

            // メインの円
            const circle = createSvgElement("circle", {
                cx: coords.x, cy: coords.y, r: SEPHIRA_R,
                class: "sephira-circle"
            });
            group.appendChild(circle);

            // 番号
            const numText = createSvgElement("text", {
                x: coords.x,
                y: coords.y - 8,
                class: "sephira-number"
            });
            numText.textContent = sephira.number;
            group.appendChild(numText);

            // 英語名
            const nameEn = createSvgElement("text", {
                x: coords.x,
                y: coords.y + 10,
                class: "sephira-name-en"
            });
            nameEn.textContent = sephira.name.en;
            group.appendChild(nameEn);

            // イベント
            group.addEventListener("click", () => onSephiraClick(sephira));
            sephirothLayer.appendChild(group);
        });

        // ダアト（点線の隠されたセフィラ）
        drawDaath();
    }

    function drawDaath() {
        const coords = toSvgCoords(DAATH.position);
        const group = createSvgElement("g", {
            class: "sephira-group",
            "data-sephira-id": "daath"
        });

        const circle = createSvgElement("circle", {
            cx: coords.x, cy: coords.y, r: DAATH_R,
            class: "daath-circle"
        });
        group.appendChild(circle);

        const nameEn = createSvgElement("text", {
            x: coords.x,
            y: coords.y + 1,
            class: "sephira-name-en",
            "font-size": "9px",
            opacity: "0.4"
        });
        nameEn.textContent = "Da'ath";
        group.appendChild(nameEn);

        const nameJa = createSvgElement("text", {
            x: coords.x,
            y: coords.y + 12,
            class: "sephira-name-ja",
            opacity: "0.3"
        });
        nameJa.textContent = "ダアト";
        group.appendChild(nameJa);

        group.addEventListener("click", () => onDaathClick());
        sephirothLayer.appendChild(group);
    }

    // ====================================================
    // インタラクション: セフィラをクリック
    // ====================================================
    function onSephiraClick(sephira) {
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
        const archangelLocal = isEn ? (sephira.archangelEn || sephira.archangel) : sephira.archangel;
        const angelOrderLocal = isEn ? (sephira.angelOrderEn || sephira.angelOrder) : sephira.angelOrder;

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
                <span class="info-meta-value">${archangelLocal}</span>
                <span class="info-meta-label">${isEn ? 'Angel Order' : '天使団'}</span>
                <span class="info-meta-value">${angelOrderLocal}</span>
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
        }

        showInfoPanel(html);
        attachCardChipEvents();
    }

    // ====================================================
    // インタラクション: パスをクリック
    // ====================================================
    function onPathClick(path) {
        setActive("path", path.number);

        const card = getCardForPath(path.number);
        const fromSephira = getSephira(path.from);
        const toSephira = getSephira(path.to);

        const inquiryLocal = isEn ? (path.inquiry_en || path.inquiry) : path.inquiry;
        const astroLocal = isEn ? (path.astrological_en || path.astrological) : path.astrological;
        const fromName = isEn ? fromSephira.name.en : fromSephira.name.ja;
        const toName = isEn ? toSephira.name.en : toSephira.name.ja;

        const hebrewMeaningLocal = isEn ? (path.hebrewMeaning_en || path.hebrewMeaning) : path.hebrewMeaning;

        let html = `
            <div class="info-path-header">
                <div class="info-path-number">PATH ${path.number}</div>
            </div>
            <div class="info-hebrew-large">${path.hebrew}</div>
            <div class="info-sephira-ja" style="text-align: center;">
                ${path.hebrewName} | ${hebrewMeaningLocal}
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
        }

        showInfoPanel(html);
        attachCardChipEvents();
    }

    function onPathHover(path, lineEl) {
        // ホバーのみ（クリックとは別）- 将来的にツールチップ等
    }

    // ====================================================
    // インタラクション: ダアトをクリック
    // ====================================================
    function onDaathClick() {
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
    }

    // ====================================================
    // パネル表示制御とドロワー操作
    // ====================================================
    function showInfoPanel(html) {
        infoPlaceholder.style.display = "none";
        infoPanel.classList.remove("hidden-section");
        infoPanel.innerHTML = html;

        openDrawer();

        // スマホ表示時、ドロワー内のスクロールをトップへ戻す
        if (window.innerWidth <= 900) {
            const inner = document.querySelector(".info-panel-inner");
            if (inner) inner.scrollTop = 0;
        }
    }

    // ====================================================
    // モバイル用スワイプ制御
    // ====================================================
    let startY = 0;
    let isDragging = false;

    function initDrawer() {
        if (!infoPanelElement) return;

        infoPanelElement.addEventListener("touchstart", (e) => {
            if (window.innerWidth >= 900) return;
            
            // パネル内部を触っている場合、上にスクロールする余裕があればスワイプを無効化
            const inner = e.target.closest(".info-panel-inner");
            if (inner && infoPanelElement.classList.contains("active-drawer")) {
                if (inner.scrollTop > 0) return; 
            }

            // アクティブ状態設定によって自動的にタイマーは止まるが明示的に呼ぶ
            resetIdleTimer();

            startY = e.touches[0].clientY;
            isDragging = true;
            infoPanelElement.style.setProperty("--drawer-offset", "0px");
            infoPanelElement.classList.add("dragging");
        }, { passive: true });

        infoPanelElement.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            const y = e.touches[0].clientY;
            const deltaY = y - startY;

            if (deltaY > 0) {
                // 下へ閉じる
                infoPanelElement.style.setProperty("--drawer-offset", `${deltaY}px`);
            } else if (deltaY < 0 && !infoPanelElement.classList.contains("active-drawer")) {
                // 上へ開く（見えている分から引っ張る）
                infoPanelElement.style.setProperty("--drawer-offset", `${deltaY}px`);
            }
        }, { passive: true });

        infoPanelElement.addEventListener("touchend", (e) => {
            if (!isDragging) return;
            isDragging = false;
            infoPanelElement.classList.remove("dragging");
            
            const currentOffset = parseFloat(infoPanelElement.style.getPropertyValue("--drawer-offset") || "0");
            infoPanelElement.style.setProperty("--drawer-offset", "0px");

            // 80px以上下へスワイプしたら閉じる
            if (currentOffset > 80) {
                closeDrawer();
            } else if (currentOffset < -40) {
                openDrawer();
            }
        });
    }

    function openDrawer() {
        if (!infoPanelElement) return;
        infoPanelElement.classList.add("active-drawer");
        infoPanelElement.classList.remove("inactive-drawer-drag");
    }

    function closeDrawer() {
        if (!infoPanelElement) return;
        infoPanelElement.classList.remove("active-drawer");
        
        // アクティブ状態の解除
        document.querySelectorAll(".sephira-group.active, .tree-path.active").forEach(el => {
            el.classList.remove("active");
        });
        activeElement = null;

        // パネルを閉じたのでアンビエントタイマーを再開
        resetIdleTimer();
    }

    // ====================================================
    // アクティブ状態管理
    // ====================================================
    function setActive(type, id) {
        // 前のアクティブをクリア
        document.querySelectorAll(".sephira-group.active, .tree-path.active").forEach(el => {
            el.classList.remove("active");
        });

        if (type === "sephira") {
            const el = document.querySelector(`[data-sephira-id="${id}"]`);
            if (el) el.classList.add("active");
        } else if (type === "path") {
            const el = document.querySelector(`[data-path-number="${id}"]`);
            if (el) el.classList.add("active");
        }

        activeElement = { type, id };
    }

    // ====================================================
    // カード図鑑（Dictionary Modal）ロジック
    // ====================================================
    const dictModal = document.getElementById("dictionary-modal");
    const dictCloseBtn = document.getElementById("close-dictionary-btn");

    function attachCardChipEvents() {
        document.querySelectorAll(".clickable-card-chip").forEach(chip => {
            chip.addEventListener("click", (e) => {
                const cardId = e.currentTarget.getAttribute("data-card-id");
                if (cardId) {
                    openDictionaryModal(cardId);
                }
            });
            // ホバー時のポインター（CSSで定義していない場合のため）
            chip.style.cursor = "pointer";
        });
    }

    function openDictionaryModal(cardId) {
        // tree-of-life.js で結合した ALL_CARDS の配列からカードを探す
        const card = (window.ALL_CARDS || [...MAJOR_ARCANA, ...MINOR_ARCANA]).find(c => c.id === cardId);
        if (!card) return;

        const isEn = window.currentLang === 'en';

        // 1. 基本情報のセット
        document.getElementById("dictionary-card-img").src = card.image + "?v=remaster";
        document.getElementById("dictionary-card-name").textContent = isEn && card.name_en ? card.name_en : card.name;
        
        let metaText = card.type === "major" ? (isEn ? "Major Arcana" : "大アルカナ") : (isEn ? "Minor Arcana" : "小アルカナ");
        if (card.element) metaText += isEn ? ` / Element: ${card.element}` : ` / 対応エレメント: ${card.element}`;
        document.getElementById("dictionary-card-meta").textContent = metaText;

        // 2. キーワードのセット
        const kwContainer = document.getElementById("dictionary-keywords");
        kwContainer.innerHTML = "";
        const keywords = isEn && card.keywords_en && card.keywords_en.length > 0 ? card.keywords_en : card.keywords;
        if (keywords && keywords.length > 0) {
            kwContainer.innerHTML = keywords.map(kw => 
                `<span class="dictionary-keyword-chip">${kw}</span>`
            ).join("");
        }

        // 3. Esoteric (神秘的対応) のセット
        const esoGrid = document.getElementById("dictionary-esoteric-grid");
        esoGrid.innerHTML = "";
        const eso = isEn && card.esoteric_en && Object.keys(card.esoteric_en).length > 0 ? card.esoteric_en : card.esoteric;
        if (eso) {
            const esoMap = isEn ? {
                "Kabbalah": eso.kabbalah,
                "Astrology": eso.astrology,
                "Alchemy": eso.alchemy,
                "I Ching": eso.iching
            } : {
                "カバラ": eso.kabbalah,
                "占星術": eso.astrology,
                "錬金術": eso.alchemy,
                "易経": eso.iching
            };
            
            for (const [label, val] of Object.entries(esoMap)) {
                if (val) {
                    esoGrid.innerHTML += `
                        <div class="eso-item" style="display:contents;">
                            <span class="eso-label">${label}</span>
                            <span class="eso-value">${val}</span>
                        </div>
                    `;
                }
            }
        } else {
            esoGrid.innerHTML = `<span class="eso-value" style="grid-column: span 2;">データがありません</span>`;
        }

        // 4. シンボル（図解）のセット
        const symTagsContainer = document.getElementById("dictionary-symbol-tags");
        const symDesc = document.getElementById("dictionary-symbol-desc");
        
        symTagsContainer.innerHTML = "";
        symDesc.classList.add("hidden-section");
        symDesc.innerHTML = "";

        if (card.symbols && card.symbols.length > 0) {
            document.getElementById("dictionary-symbols-container").style.display = "block";
            
            card.symbols.forEach(sym => {
                const symName = isEn && sym.name_en ? sym.name_en : sym.name;
                const symDescTxt = isEn && sym.desc_en ? sym.desc_en : sym.desc;

                const tag = document.createElement("div");
                tag.className = "symbol-tag";
                tag.textContent = symName;
                
                // ホバー/クリックで解説＆ハイライト
                const handleSymbolInteraction = () => {
                    // 全タグのアクティブ状態をリセット
                    symTagsContainer.querySelectorAll(".symbol-tag").forEach(t => t.style.borderColor = "rgba(212,175,55,0.4)");
                    tag.style.borderColor = "var(--accent-gold)";

                    // 解説を表示
                    symDesc.classList.remove("hidden-section");
                    symDesc.innerHTML = `<strong>${symName}</strong><br>${symDescTxt}`;
                };

                tag.addEventListener("click", handleSymbolInteraction);
                tag.addEventListener("mouseenter", handleSymbolInteraction);
                symTagsContainer.appendChild(tag);
            });
        } else {
            document.getElementById("dictionary-symbols-container").style.display = "none";
        }

        // モーダルを開く
        dictModal.classList.add("active");
        document.body.style.overflow = "hidden"; // 背景のスクロールを止める
    }

    function closeDictionaryModal() {
        dictModal.classList.remove("active");
        document.body.style.overflow = "";
    }

    dictCloseBtn.addEventListener("click", closeDictionaryModal);
    dictModal.addEventListener("click", (e) => {
        if (e.target === dictModal) closeDictionaryModal();
    });

    // ====================================================
    // リーディング結果からのハイライト処理
    // ====================================================
    function processReadingParams() {
        const params = new URLSearchParams(window.location.search);
        const cardsParam = params.get("cards");
        if (!cardsParam) return;

        const drawnIds = cardsParam.split(",");
        let highlightHtml = `
            <div style="text-align:center; padding: 1rem 0;">
                <h3 style="color: var(--accent-gold); font-family: var(--font-heading); letter-spacing: 0.1em; margin-bottom: 0.5rem;">YOUR READING</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
                    ${isEn ? "The positions of the drawn cards on the Tree of Life<br>are indicated by a golden glow." : "引いたカードが生命の樹のどこに位置するか、<br>黄金の輝きで示されています。"}
                </p>
                <div class="info-card-chips" style="justify-content: center; gap: 10px;">
        `;

        drawnIds.forEach(cardId => {
            const card = (window.ALL_CARDS || [...MAJOR_ARCANA, ...MINOR_ARCANA]).find(c => c.id === cardId);
            if (!card) return;

            // チップの追加
            highlightHtml += `<span class="info-card-chip clickable-card-chip" data-card-id="${card.id}">${card.name}</span>`;

            // 大アルカナ（パス）の判定
            if (card.type === "major") {
                const pathInfo = getPathForCard(cardId);
                if (pathInfo) {
                    const pathEl = document.querySelector(`.tree-path[data-path-number="${pathInfo.number}"]`);
                    if (pathEl) pathEl.classList.add("reading-highlight");
                }
            } 
            // 小アルカナ・コートカード（セフィラ）の判定
            else {
                let sephiraId = null;
                if (["knight", "queen", "prince", "princess"].includes(card.number)) {
                    sephiraId = COURT_RANK_MAP[card.number].sephiraId;
                } else {
                    const num = parseInt(card.number, 10);
                    if (!isNaN(num) && num >= 1 && num <= 10) {
                        const s = getSephiraByNumber(num);
                        if (s) sephiraId = s.id;
                    }
                }

                if (sephiraId) {
                    const sephiraEl = document.querySelector(`.sephira-group[data-sephira-id="${sephiraId}"]`);
                    if (sephiraEl) sephiraEl.classList.add("reading-highlight");
                }
            }
        });

        highlightHtml += `
                </div>
                <p style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 1.5rem; opacity: 0.7;">
                    ${isEn ? "Touch a chip to open the Card Dictionary." : "チップに触れるとカード図鑑が開きます。"}
                </p>
            </div>
        `;

        showInfoPanel(highlightHtml);
        attachCardChipEvents();
    }

    // ====================================================
    // 初期化
    // ====================================================
    function init() {
        initDrawer();
        applyI18nToStaticHtml();
        drawPaths();
        drawAbyss();
        drawSephiroth();
        processReadingParams();

        const langToggleBtn = document.getElementById('lang-toggle-btn');
        if (langToggleBtn) langToggleBtn.addEventListener('click', switchLang);

        // ユーザーインタラクションの監視（アンビエントタイマー用）
        document.addEventListener("mousemove", resetIdleTimer, { passive: true });
        document.addEventListener("click", resetIdleTimer, { passive: true });
        document.addEventListener("touchstart", resetIdleTimer, { passive: true });
        document.addEventListener("scroll", resetIdleTimer, { passive: true });

        // 初期タイマー起動
        resetIdleTimer();
    }

    // DOMContentLoaded で起動
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
