// ====================================================
// 生命の樹｜Tree of Life ── UI描画 & インタラクション
// ====================================================

(function () {
    "use strict";

    // --- 定数 ---
    const SVG_NS = "http://www.w3.org/2000/svg";
    const VIEWBOX_W = 500;
    const VIEWBOX_H = 700;
    const SEPHIRA_R = 28;   // セフィラの半径
    const DAATH_R = 20;     // ダアトの半径

    // --- DOM参照 ---
    const svgEl = document.getElementById("tree-svg");
    const pathsLayer = document.getElementById("paths-layer");
    const abyssLayer = document.getElementById("abyss-layer");
    const sephirothLayer = document.getElementById("sephiroth-layer");
    const infoPanel = document.getElementById("info-content");
    const infoPlaceholder = document.getElementById("info-placeholder");
    const treeContainer = document.getElementById("tree-container");

    // --- アクティブ状態の追跡 ---
    let activeElement = null;

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
                stroke: sephira.color.queen,
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

            // 番号（左上に小さく）
            const numText = createSvgElement("text", {
                x: coords.x,
                y: coords.y - 12,
                class: "sephira-number"
            });
            numText.textContent = sephira.number;
            group.appendChild(numText);

            // 英語名
            const nameEn = createSvgElement("text", {
                x: coords.x,
                y: coords.y + 1,
                class: "sephira-name-en"
            });
            nameEn.textContent = sephira.name.en;
            group.appendChild(nameEn);

            // 日本語名
            const nameJa = createSvgElement("text", {
                x: coords.x,
                y: coords.y + 14,
                class: "sephira-name-ja"
            });
            nameJa.textContent = sephira.name.ja;
            group.appendChild(nameJa);

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
    }

    // ====================================================
    // パネル表示制御
    // ====================================================
    function showInfoPanel(html) {
        infoPlaceholder.style.display = "none";
        infoPanel.classList.remove("hidden-section");
        infoPanel.innerHTML = html;

        // スマホ表示時（画面幅が狭い場合）は自動で説明パネルへスクロールする
        if (window.innerWidth <= 768) {
            const asidePanel = document.getElementById("info-panel");
            if (asidePanel) {
                // 少し上部に余裕を持たせてスクロール
                const yOffset = -20;
                const y = asidePanel.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
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
        const card = typeof ALL_CARDS !== 'undefined' ? ALL_CARDS.find(c => c.id === cardId) : null;
        if (!card) return;

        // 1. 基本情報のセット
        document.getElementById("dictionary-card-img").src = card.image + "?v=remaster";
        document.getElementById("dictionary-card-name").textContent = card.name;
        
        let metaText = card.type === "major" ? "大アルカナ" : "小アルカナ";
        if (card.element) metaText += ` / 対応エレメント: ${card.element}`;
        document.getElementById("dictionary-card-meta").textContent = metaText;

        // 2. キーワードのセット
        const kwContainer = document.getElementById("dictionary-keywords");
        kwContainer.innerHTML = "";
        if (card.keywords && card.keywords.length > 0) {
            kwContainer.innerHTML = card.keywords.map(kw => 
                `<span class="dictionary-keyword-chip">${kw}</span>`
            ).join("");
        }

        // 3. Esoteric (神秘的対応) のセット
        const esoGrid = document.getElementById("dictionary-esoteric-grid");
        esoGrid.innerHTML = "";
        if (card.esoteric) {
            const esoMap = {
                "カバラ": card.esoteric.kabbalah,
                "占星術": card.esoteric.astrology,
                "錬金術": card.esoteric.alchemy,
                "易経": card.esoteric.iching
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
                const tag = document.createElement("div");
                tag.className = "symbol-tag";
                tag.textContent = sym.name;
                
                // ホバー/クリックで解説＆ハイライト
                const handleSymbolInteraction = () => {
                    // 全タグのアクティブ状態をリセット
                    symTagsContainer.querySelectorAll(".symbol-tag").forEach(t => t.style.borderColor = "rgba(212,175,55,0.4)");
                    tag.style.borderColor = "var(--accent-gold)";

                    // 解説を表示
                    symDesc.classList.remove("hidden-section");
                    symDesc.innerHTML = `<strong>${sym.name}</strong><br>${sym.desc}`;
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
                    引いたカードが生命の樹のどこに位置するか、<br>黄金の輝きで示されています。
                </p>
                <div class="info-card-chips" style="justify-content: center; gap: 10px;">
        `;

        drawnIds.forEach(cardId => {
            const card = typeof ALL_CARDS !== 'undefined' ? ALL_CARDS.find(c => c.id === cardId) : null;
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
                    チップに触れるとカード図鑑が開きます。
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
        drawPaths();
        drawAbyss();
        drawSephiroth();
        processReadingParams();
    }

    // DOMContentLoaded で起動
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
