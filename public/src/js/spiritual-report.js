// ====================================================
// 🔮 霊的カルテ｜Spiritual Report ── フロントエンドロジック
// モバイルファースト・ハーフモーダル連動・双方向インタラクション
// ====================================================

(function () {
    "use strict";

    // --- 定数と設定 ---
    const SVG_NS = "http://www.w3.org/2000/svg";
    const VIEWBOX_W = 500;
    const VIEWBOX_H = 700;
    const SEPHIRA_R = 40;
    const DAATH_R = 26;

    // APIのベースURL決定（開発環境と本番環境の自動切り替え）
    const API_BASE = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:8000"
        : "https://thoth-tarot-api.onrender.com";

    // カバラ要素のキーワードマッピング（スクロール連動ハイライト用）
    const SEPHIRA_KEYWORDS = {
        "kether": "ケテル", "chokmah": "コクマー", "binah": "ビナー",
        "chesed": "ケセド", "geburah": "ゲブラー", "tiphareth": "ティファレト",
        "netzach": "ネツァク", "hod": "ホド", "yesod": "イェソド", "malkuth": "マルクト", "daath": "ダアト"
    };

    const PATH_KEYWORDS = {
        11: "愚者", 12: "魔術師", 13: "女教皇", 14: "女帝", 15: "星", 16: "神官",
        17: "恋人", 18: "戦車", 19: "欲望", 20: "隠者", 21: "運命", 22: "調整",
        23: "吊るされた男", 24: "死神", 25: "術", 26: "悪魔", 27: "塔",
        28: "皇帝", 29: "月", 30: "太陽", 31: "永劫", 32: "宇宙"
    };

    // --- DOM要素の参照 ---
    const svgEl = document.getElementById("tree-svg");
    const pathsLayer = document.getElementById("paths-layer");
    const abyssLayer = document.getElementById("abyss-layer");
    const sephirothLayer = document.getElementById("sephiroth-layer");

    const bottomSheet = document.getElementById("bottom-sheet");
    const handleWrapper = document.getElementById("sheet-handle-wrapper");
    const contentWrapper = document.getElementById("sheet-content-wrapper");
    
    const loadingEl = document.getElementById("report-loading");
    const textContainer = document.getElementById("report-text-container");
    const metaInfoEl = document.getElementById("report-meta-info");
    const reportBodyEl = document.getElementById("report-body");

    // --- 状態管理 ---
    let reportData = null;
    let activatedSephiroth = [];
    let activatedPaths = [];
    
    // ボトムシートのドラッグ状態
    let isMobile = window.innerWidth < 768;
    let sheetState = "collapsed"; // collapsed, half, expanded
    let isDragging = false;
    let startY = 0;
    let currentY = 0;
    let startTranslateY = 0;
    let sheetHeight = 0;
    let snapPositions = { collapsed: 0, half: 0, expanded: 0 };

    // ====================================================
    // 1. 座標変換ヘルパー & SVG生成
    // ====================================================
    function toSvgCoords(position) {
        return {
            x: (position.x / 100) * VIEWBOX_W,
            y: (position.y / 100) * VIEWBOX_H
        };
    }

    function createSvgElement(tag, attrs) {
        const el = document.createElementNS(SVG_NS, tag);
        for (const [key, val] of Object.entries(attrs)) {
            el.setAttribute(key, val);
        }
        return el;
    }

    // ====================================================
    // 2. 生命の樹のSVG描画処理
    // ====================================================
    function drawPaths() {
        if (!PATHS) return;
        PATHS.forEach(path => {
            const fromSephira = getSephira(path.from);
            const toSephira = getSephira(path.to);
            if (!fromSephira || !toSephira) return;

            const from = toSvgCoords(fromSephira.position);
            const to = toSvgCoords(toSephira.position);

            const line = createSvgElement("line", {
                x1: from.x, y1: from.y,
                x2: to.x, y2: to.y,
                class: "tree-path",
                "data-path-number": path.number
            });

            // クリックイベントのバインド
            line.addEventListener("click", () => scrollToKabbalahElement("path", path.number));
            pathsLayer.appendChild(line);

            // ヘブライ文字
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
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

    function drawAbyss() {
        if (!DAATH) return;
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

    function drawSephiroth() {
        if (!SEPHIROTH) return;
        SEPHIROTH.forEach(sephira => {
            const coords = toSvgCoords(sephira.position);
            const group = createSvgElement("g", {
                class: "sephira-group",
                "data-sephira-id": sephira.id
            });

            // 外側の光輪効果
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

            group.addEventListener("click", () => scrollToKabbalahElement("sephira", sephira.id));
            sephirothLayer.appendChild(group);
        });

        // ダアトの描画
        drawDaath();
    }

    function drawDaath() {
        if (!DAATH) return;
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

        group.addEventListener("click", () => scrollToKabbalahElement("sephira", "daath"));
        sephirothLayer.appendChild(group);
    }

    // ====================================================
    // 3. データ取得 & 霊的カルテ API 通信
    // ====================================================
    async function loadSpiritualReport() {
        // セッションまたはローカルストレージから最新のリーディングデータを取得
        const recentReadingStr = localStorage.getItem("recent_reading") || sessionStorage.getItem("recent_reading");
        if (!recentReadingStr) {
            showError("最新のリーディング結果が見つかりません。まずはリーディングを行ってください。");
            return;
        }

        try {
            const readingData = JSON.parse(recentReadingStr);
            const cards = readingData.cards;
            const userName = readingData.userName || "";
            const birthDate = readingData.birthDate || "";
            const theme = readingData.theme || "総合リーディング";

            if (!cards || cards.length === 0) {
                showError("リーディング結果にカードデータが含まれていません。");
                return;
            }

            // メタ情報の表示
            renderMetaInfo(userName, birthDate, theme);

            // APIリクエストのペイロード構成
            const payload = {
                cards: cards.map(c => ({
                    card_id: c.id,
                    card_name: c.name,
                    card_element: c.element || ""
                })),
                user_name: userName,
                birth_date: birthDate,
                theme: theme,
                language: "ja"
            };

            // APIの呼び出し
            const response = await fetch(`${API_BASE}/api/spiritual-report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            reportData = await response.json();
            activatedSephiroth = reportData.activatedSephiroth || [];
            activatedPaths = reportData.activatedPaths || [];

            // APIデータに基づいて生命の樹をハイライト
            highlightActivatedElements();

            // レポート文のパースとレンダリング
            renderReportBody(reportData.reportText);

            // ローディングを隠して本文を表示
            loadingEl.classList.add("hidden-section");
            loadingEl.style.display = "none";
            textContainer.classList.remove("hidden-section");

            // レスポンシブに応じた初期展開状態のセット
            updateSheetPositions();
            if (isMobile) {
                setSheetState("half"); // モバイルでは半分展開してカルテが見えるようにする
            }

            // 保存・コピー用ボタンの設定
            setupActionButtons(userName, birthDate, theme);

            // スクロール連動ハイライトの初期化と確実な初期描画のための遅延処理
            setTimeout(() => {
                highlightActivatedElements();
                initScrollObserver();
            }, 300);

        } catch (error) {
            console.error("Failed to load spiritual report:", error);
            showError("霊的カルテの生成に失敗しました。時間をおいて再度お試しください。");
        }
    }

    function renderMetaInfo(name, birth, theme) {
        let html = `
            <div class="report-meta-item"><strong>THEME</strong>${escapeHtml(theme)}</div>
        `;
        if (name && name !== "あなた") {
            html += `<div class="report-meta-item"><strong>SEEKER</strong>${escapeHtml(name)}</div>`;
        }
        if (birth) {
            html += `<div class="report-meta-item"><strong>BIRTH DATE</strong>${escapeHtml(birth)}</div>`;
        }
        metaInfoEl.innerHTML = html;
    }

    // プレーンテキストのレポート文章をパースしてHTML化する（引き算の美学の具現化）
    function renderReportBody(text) {
        if (!text) return;

        // 改行コードで分割
        const lines = text.split("\n");
        let html = "";
        let isClosure = false;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;

            // 最後の結びの言葉
            if (trimmed.includes("Love is the law") || trimmed.includes("love under will")) {
                isClosure = true;
                html += `<div class="report-closure">${escapeHtml(trimmed)}</div>`;
                return;
            }

            // 章タイトル見出しのパース (例: "1. 魂の現在地 ｜ 活性化されたセフィラ")
            // markdown記号を排除しているため、プレーンテキストとして「1.」「2.」「3.」で始まるものを検出
            const isHeading = /^[1-3]\.\s+/.test(trimmed) || trimmed.startsWith("霊的カルテ");
            
            if (isHeading) {
                let idAttr = "";
                if (trimmed.includes("1.") || trimmed.includes("現在地")) idAttr = 'id="section-sephiroth"';
                else if (trimmed.includes("2.") || trimmed.includes("変容")) idAttr = 'id="section-paths"';
                else if (trimmed.includes("3.") || trimmed.includes("作業")) idAttr = 'id="section-guidance"';

                html += `<h3 class="report-section-header" ${idAttr}>${escapeHtml(trimmed)}</h3>`;
            } else {
                // 段落テキスト
                // スクロール連動用に、この段落が言及しているカバラ要素を分析
                let targetAttr = "";
                
                // セフィラのチェック
                for (const [key, jpName] of Object.entries(SEPHIRA_KEYWORDS)) {
                    if (trimmed.includes(jpName)) {
                        targetAttr = `data-sephira-target="${key}"`;
                        break;
                    }
                }
                
                // パスのチェック（セフィラが含まれていない場合のみ）
                if (!targetAttr) {
                    for (const [num, jpName] of Object.entries(PATH_KEYWORDS)) {
                        if (trimmed.includes(jpName)) {
                            targetAttr = `data-path-target="${num}"`;
                            break;
                        }
                    }
                }

                html += `<p class="report-paragraph" ${targetAttr}>${escapeHtml(trimmed)}</p>`;
            }
        });

        reportBodyEl.innerHTML = html;
    }

    // ====================================================
    // 4. 生命の樹の活性化ハイライト
    // ====================================================
    function highlightActivatedElements() {
        // 全体の非活性化（初期化）
        document.querySelectorAll(".sephira-group, .tree-path").forEach(el => {
            el.classList.remove("reading-highlight");
        });

        // 活性化セフィラを光らせる
        activatedSephiroth.forEach(sephiraId => {
            const el = document.querySelector(`.sephira-group[data-sephira-id="${sephiraId}"]`);
            if (el) el.classList.add("reading-highlight");
        });

        // 活性化パスを光らせる
        activatedPaths.forEach(pathNum => {
            const el = document.querySelector(`.tree-path[data-path-number="${pathNum}"]`);
            if (el) {
                el.classList.add("reading-highlight");
                // ヘブライ文字ラベルも光らせる
                const label = el.nextElementSibling;
                if (label && label.classList.contains("path-label")) {
                    label.style.fill = "#FFD700";
                    label.style.fontWeight = "bold";
                }
            }
        });
    }

    // ====================================================
    // 5. 双方向連動インタラクション
    // ====================================================

    // A. SVG要素クリック時 ──> モーダル内対応箇所へスムーズスクロール
    function scrollToKabbalahElement(type, id) {
        // モバイルの場合はまずシートを大きく展開する
        if (isMobile) {
            setSheetState("expanded");
        }

        let targetEl = null;

        if (type === "sephira") {
            // そのセフィラを扱っている段落を優先的に探す
            targetEl = document.querySelector(`[data-sephira-target="${id}"]`);
            if (!targetEl && id === "daath") {
                // ダアトの場合は第1章の末尾などにするか、第1章の先頭へ
                targetEl = document.getElementById("section-sephiroth");
            } else if (!targetEl) {
                // 見つからなければ、第1章（セフィラ章）のタイトルへ
                targetEl = document.getElementById("section-sephiroth");
            }
        } else if (type === "path") {
            // そのパスを扱っている段落を優先的に探す
            targetEl = document.querySelector(`[data-path-target="${id}"]`);
            if (!targetEl) {
                // 見つからなければ、第2章（パス章）のタイトルへ
                targetEl = document.getElementById("section-paths");
            }
        }

        if (targetEl) {
            // スムーズスクロール実行
            setTimeout(() => {
                targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
                
                // 一時的にテキストをフラッシュさせて視認性を高める
                targetEl.classList.add("focused-para");
                setTimeout(() => targetEl.classList.remove("focused-para"), 2000);
            }, 100);
        }
    }

    // B. モーダルスクロール時 ──> SVG要素のダイナミック発光連動
    let observer = null;
    function initScrollObserver() {
        if (observer) observer.disconnect();

        // 監視対象はすべての段落と章タイトル
        const targets = document.querySelectorAll(".report-paragraph, .report-section-header");
        
        // ビューポートのほぼ中央（縦方向30%〜70%）に入ったことを検出する設定
        const options = {
            root: isMobile ? contentWrapper : null, // モバイルではスクロールするラッパーを基準に
            rootMargin: "-25% 0px -40% 0px", // 画面中央付近の帯状エリアを検知
            threshold: 0
        };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // 現在のアクティブ段落にフォーカス用クラスを付与
                    document.querySelectorAll(".report-paragraph.focused-para").forEach(p => p.classList.remove("focused-para"));
                    el.classList.add("focused-para");

                    // 生命の樹SVG上でのシンクロ発光処理
                    let targetType = null;
                    let targetId = null;

                    if (el.hasAttribute("data-sephira-target")) {
                        targetType = "sephira";
                        targetId = el.getAttribute("data-sephira-target");
                    } else if (el.hasAttribute("data-path-target")) {
                        targetType = "path";
                        targetId = parseInt(el.getAttribute("data-path-target"), 10);
                    } else if (el.id === "section-sephiroth") {
                        // 1章全体のタイトルの時は、活性化されているセフィラ全てを緩やかに再点滅させるなどのリセット
                        highlightActivatedElements();
                        return;
                    } else if (el.id === "section-paths") {
                        highlightActivatedElements();
                        return;
                    }

                    if (targetType && targetId) {
                        // 読んでいる要素だけを「より強力に」発光させ、他を少し落とす
                        document.querySelectorAll(".sephira-group, .tree-path").forEach(svgNode => {
                            svgNode.style.transition = "all 0.5s ease";
                            // セフィロトページと同じ仕様にするため、全体を暗くする処理を削除
                        });

                        if (targetType === "sephira") {
                            const node = document.querySelector(`.sephira-group[data-sephira-id="${targetId}"]`);
                            if (node) {
                                node.style.opacity = "1";
                                node.style.filter = "drop-shadow(0 0 25px #FFD700)";
                            }
                        } else if (targetType === "path") {
                            const node = document.querySelector(`.tree-path[data-path-number="${targetId}"]`);
                            if (node) {
                                node.style.opacity = "1";
                                node.style.filter = "drop-shadow(0 0 20px #FFD700)";
                                node.style.strokeWidth = "5px";
                            }
                        }
                    } else {
                        // 特定要素への言及がない段落の場合、デフォルトの活性化状態に戻す
                        resetSvgStyles();
                    }
                }
            });
        }, options);

        targets.forEach(t => observer.observe(t));
    }

    function resetSvgStyles() {
        document.querySelectorAll(".sephira-group, .tree-path").forEach(svgNode => {
            svgNode.style.opacity = "";
            svgNode.style.filter = "";
            svgNode.style.strokeWidth = "";
            svgNode.style.transition = "";
        });
        highlightActivatedElements();
    }

    // ====================================================
    // 6. 📱 モバイル用ハーフモーダル（ボトムシート）制御 (Pointer Events)
    // ====================================================
    function updateSheetPositions() {
        sheetHeight = window.innerHeight - 110; // CSSの --sheet-height と連動
        const collapsedVisible = 120; // 閉じた時に見せたい高さ

        snapPositions = {
            expanded: 110, // 上から110pxの位置
            half: window.innerHeight * 0.5,   // 上から50%の位置
            collapsed: window.innerHeight - collapsedVisible // 折りたたみ
        };
    }

    function setSheetState(state) {
        if (!isMobile) return;
        sheetState = state;
        const targetY = snapPositions[state];
        const translateY = targetY;

        bottomSheet.style.transition = "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)";
        bottomSheet.style.transform = `translateY(${translateY}px)`;

        // 状態に合わせてコンテンツのスクロール可否を制御
        if (state === "expanded") {
            contentWrapper.style.overflowY = "auto";
        } else {
            contentWrapper.style.overflowY = "hidden";
            contentWrapper.scrollTop = 0; // 閉じている時はトップに戻す
        }
    }

    function initBottomSheetEvents() {
        if (!isMobile) {
            bottomSheet.style.transform = "none";
            contentWrapper.style.overflowY = "auto";
            return;
        }

        updateSheetPositions();
        setSheetState("collapsed"); // 初期状態は最下部

        // ドラッグ開始
        handleWrapper.addEventListener("pointerdown", onDragStart);
        // コンテンツラッパーでも、スクロールが最上部にあり、かつ下へドラッグしたい場合にボトムシート全体をドラッグできるようにする
        contentWrapper.addEventListener("pointerdown", (e) => {
            if (contentWrapper.scrollTop <= 0 && sheetState === "expanded") {
                onDragStart(e);
            }
        });

        window.addEventListener("pointermove", onDragMove);
        window.addEventListener("pointerup", onDragEnd);
        window.addEventListener("pointercancel", onDragEnd);
    }

    function onDragStart(e) {
        // テキスト選択やブラウザ標準スクロールのバッティングを防止
        if (e.target.tagName === "A" || e.target.tagName === "BUTTON") return;
        
        isDragging = true;
        startY = e.clientY;
        currentY = e.clientY; // タップ判定用に初期化
        
        // 現在のボトムシートの実際の translateY 位置を取得
        const style = window.getComputedStyle(bottomSheet);
        const matrix = new WebKitCSSMatrix(style.transform);
        startTranslateY = matrix.m41; // Y方向の現在のズレ（ピクセル）

        bottomSheet.classList.add("dragging");
        handleWrapper.setPointerCapture(e.pointerId);
    }

    function onDragMove(e) {
        if (!isDragging) return;

        currentY = e.clientY;
        const deltaY = currentY - startY;
        let newTranslateY = startTranslateY + deltaY;

        // 上限（expanded状態より上）と下限（collapsedより下）に制限（少し抵抗を持たせる）
        const topLimit = snapPositions.expanded;
        const bottomLimit = snapPositions.collapsed;

        if (newTranslateY < topLimit) {
            // 上に引っ張る時はラバーバンド効果（動きを鈍くする）
            newTranslateY = topLimit + (newTranslateY - topLimit) * 0.3;
        } else if (newTranslateY > bottomLimit) {
            newTranslateY = bottomLimit + (newTranslateY - bottomLimit) * 0.2;
        }

        bottomSheet.style.transform = `translateY(${newTranslateY}px)`;
    }

    function onDragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        bottomSheet.classList.remove("dragging");

        const deltaY = currentY - startY;

        // 移動距離が5px未満の場合は「タップ（クリック）」とみなして開閉をトグルする
        if (Math.abs(deltaY) < 5) {
            if (sheetState === "expanded") {
                setSheetState("collapsed");
            } else {
                setSheetState("expanded");
            }
            return;
        }

        const style = window.getComputedStyle(bottomSheet);
        const matrix = new WebKitCSSMatrix(style.transform);
        const finalTranslateY = matrix.m41;

        // 各吸着ポイントへの距離を計算し、最も近い状態にスナップ
        const distToExpanded = Math.abs(finalTranslateY - snapPositions.expanded);
        const distToHalf = Math.abs(finalTranslateY - snapPositions.half);
        const distToCollapsed = Math.abs(finalTranslateY - snapPositions.collapsed);

        const minDist = Math.min(distToExpanded, distToHalf, distToCollapsed);

        if (minDist === distToExpanded) {
            setSheetState("expanded");
        } else if (minDist === distToHalf) {
            setSheetState("half");
        } else {
            setSheetState("collapsed");
        }
    }

    // ====================================================
    // 6.5. 霊的カルテの保存・コピー処理
    // ====================================================
    function customizeSvgForCapture(svgClone) {
        svgClone.style.background = '#ffffff';
        svgClone.style.width = '100%';
        svgClone.style.maxWidth = '360px';
        svgClone.style.height = 'auto';
        svgClone.style.display = 'block';
        svgClone.style.margin = '0 auto 30px auto';

        // 1. パスの処理
        const paths = svgClone.querySelectorAll('.tree-path');
        paths.forEach(p => {
            const isActivated = p.classList.contains('reading-highlight');
            p.setAttribute('stroke', isActivated ? '#d4af37' : '#e0e0e0');
            p.setAttribute('stroke-width', isActivated ? '4' : '2');
            p.style.opacity = '1';
            p.style.filter = '';
        });

        // 2. アビス線の処理
        const abyssLines = svgClone.querySelectorAll('.abyss-line');
        abyssLines.forEach(l => {
            l.setAttribute('stroke', '#cccccc');
            l.setAttribute('stroke-dasharray', '4');
            l.style.opacity = '1';
        });
        const abyssLabels = svgClone.querySelectorAll('.abyss-label');
        abyssLabels.forEach(lbl => {
            lbl.setAttribute('fill', '#888888');
            lbl.setAttribute('font-size', '10px');
            lbl.setAttribute('font-family', 'sans-serif');
            lbl.style.opacity = '1';
        });

        // 3. パスラベル（ヘブライ文字）の処理
        const pathLabels = svgClone.querySelectorAll('.path-label');
        pathLabels.forEach(lbl => {
            const prevLine = lbl.previousElementSibling;
            const isActivated = prevLine && prevLine.classList.contains('reading-highlight');
            lbl.setAttribute('fill', isActivated ? '#d4af37' : '#aaaaaa');
            lbl.setAttribute('font-family', 'sans-serif');
            lbl.setAttribute('font-size', '10px');
            lbl.style.fill = isActivated ? '#d4af37' : '#aaaaaa';
            lbl.style.opacity = '1';
        });

        // 4. セフィラの処理
        const sephiraGroups = svgClone.querySelectorAll('.sephira-group');
        sephiraGroups.forEach(g => {
            const isActivated = g.classList.contains('reading-highlight');

            // 円の処理
            const circle = g.querySelector('.sephira-circle, .daath-circle');
            if (circle) {
                circle.setAttribute('fill', '#ffffff');
                circle.setAttribute('stroke', isActivated ? '#d4af37' : '#666666');
                circle.setAttribute('stroke-width', isActivated ? '3' : '1.5');
                circle.style.fill = '#ffffff';
                circle.style.stroke = isActivated ? '#d4af37' : '#666666';
                circle.style.strokeWidth = isActivated ? '3px' : '1.5px';
            }

            // 外側の光輪（glow）の処理
            const glow = g.querySelector('.sephira-glow');
            if (glow) {
                glow.setAttribute('stroke', isActivated ? '#d4af37' : '#cccccc');
                glow.setAttribute('stroke-width', isActivated ? '1.5' : '0.5');
                glow.setAttribute('opacity', isActivated ? '0.8' : '0.2');
                glow.style.stroke = isActivated ? '#d4af37' : '#cccccc';
                glow.style.strokeWidth = isActivated ? '1.5px' : '0.5px';
                glow.style.opacity = isActivated ? '0.8' : '0.2';
            }

            // 番号の処理
            const numText = g.querySelector('.sephira-number');
            if (numText) {
                numText.setAttribute('fill', isActivated ? '#d4af37' : '#888888');
                numText.setAttribute('font-family', 'sans-serif');
                numText.setAttribute('font-size', '10px');
                numText.style.fill = isActivated ? '#d4af37' : '#888888';
                numText.style.opacity = '1';
            }

            // 英語名の処理
            const nameEn = g.querySelector('.sephira-name-en');
            if (nameEn) {
                nameEn.setAttribute('fill', isActivated ? '#d4af37' : '#333333');
                nameEn.setAttribute('font-family', 'sans-serif');
                nameEn.setAttribute('font-size', '10px');
                nameEn.setAttribute('font-weight', isActivated ? 'bold' : 'normal');
                nameEn.style.fill = isActivated ? '#d4af37' : '#333333';
                nameEn.style.fontWeight = isActivated ? 'bold' : 'normal';
                nameEn.style.opacity = '1';
            }

            // 日本語名の処理
            const nameJa = g.querySelector('.sephira-name-ja');
            if (nameJa) {
                nameJa.setAttribute('fill', isActivated ? '#d4af37' : '#666666');
                nameJa.setAttribute('font-family', 'sans-serif');
                nameJa.setAttribute('font-size', '10px');
                nameJa.setAttribute('font-weight', isActivated ? 'bold' : 'normal');
                nameJa.style.fill = isActivated ? '#d4af37' : '#666666';
                nameJa.style.fontWeight = isActivated ? 'bold' : 'normal';
                nameJa.style.opacity = '1';
            }
        });
    }

    async function generateAndDownloadReportImage(filename, userName, birthDate, theme) {
        if (!reportData) return;

        const captureContainer = document.createElement('div');
        captureContainer.style.position = 'fixed';
        captureContainer.style.top = '0';
        captureContainer.style.left = '0';
        captureContainer.style.width = '100vw';
        captureContainer.style.height = '100vh';
        captureContainer.style.overflowY = 'auto';
        captureContainer.style.padding = '50px';
        captureContainer.style.background = '#ffffff';
        captureContainer.style.color = '#111111';
        captureContainer.style.fontFamily = '"Noto Serif JP", serif';
        captureContainer.style.boxSizing = 'border-box';
        captureContainer.style.zIndex = '99999';

        const innerWrapper = document.createElement('div');
        innerWrapper.style.maxWidth = '800px';
        innerWrapper.style.margin = '0 auto';
        innerWrapper.style.background = '#ffffff';
        captureContainer.appendChild(innerWrapper);

        // タイトル
        const titleDiv = document.createElement('h2');
        titleDiv.innerText = 'Spiritual Chart ｜ 霊的カルテ';
        titleDiv.style.textAlign = 'center';
        titleDiv.style.color = '#d4af37';
        titleDiv.style.borderBottom = '1px solid #eeeeee';
        titleDiv.style.paddingBottom = '20px';
        titleDiv.style.fontFamily = '"Julius Sans One", serif';
        titleDiv.style.letterSpacing = '2px';
        titleDiv.style.fontSize = '24px';
        innerWrapper.appendChild(titleDiv);

        // メタ情報
        const metaDiv = document.createElement('div');
        metaDiv.style.background = '#f9f9f9';
        metaDiv.style.borderLeft = '6px solid #d4af37';
        metaDiv.style.padding = '20px';
        metaDiv.style.margin = '30px 0';
        metaDiv.style.fontSize = '15px';
        metaDiv.style.lineHeight = '1.6';
        
        let metaHtml = `<strong>THEME:</strong> ${escapeHtml(theme || '総合リーディング')}<br>`;
        if (userName && userName !== 'あなた') {
            metaHtml += `<strong>SEEKER:</strong> ${escapeHtml(userName)}<br>`;
        }
        if (birthDate) {
            metaHtml += `<strong>BIRTH DATE:</strong> ${escapeHtml(birthDate)}<br>`;
        }
        metaDiv.innerHTML = metaHtml;
        innerWrapper.appendChild(metaDiv);

        // 生命の樹のSVGをクローンして調整
        const svgClone = document.getElementById("tree-svg").cloneNode(true);
        customizeSvgForCapture(svgClone);
        innerWrapper.appendChild(svgClone);

        // レポート本文
        const bodyDiv = document.createElement('div');
        bodyDiv.style.lineHeight = '1.8';
        bodyDiv.style.fontSize = '15px';
        bodyDiv.style.borderTop = '1px dotted #cccccc';
        bodyDiv.style.paddingTop = '30px';
        
        // 元のHTMLをクローンしてインラインで綺麗にする
        const reportBodyClone = reportBodyEl.cloneNode(true);
        
        // クローンされた要素のスタイルを調整（白背景用）
        reportBodyClone.querySelectorAll('h3').forEach(h => {
            h.style.color = '#d4af37';
            h.style.borderBottom = '1px solid #f0f0f0';
            h.style.paddingBottom = '8px';
            h.style.marginTop = '30px';
            h.style.fontSize = '18px';
            h.style.fontFamily = '"Noto Serif JP", serif';
        });
        reportBodyClone.querySelectorAll('p').forEach(p => {
            p.style.marginBottom = '20px';
            p.style.color = '#333333';
            p.style.fontSize = '15px';
            p.style.lineHeight = '1.8';
        });
        
        // アクションボタンコンテナは画像に入れないように削除
        const actionsInClone = reportBodyClone.querySelector('.report-actions');
        if (actionsInClone) {
            reportBodyClone.removeChild(actionsInClone);
        }
        
        reportBodyClone.querySelectorAll('.report-closure').forEach(c => {
            c.style.textAlign = 'center';
            c.style.fontStyle = 'italic';
            c.style.color = '#888888';
            c.style.marginTop = '40px';
            c.style.fontSize = '16px';
        });
        
        bodyDiv.appendChild(reportBodyClone);
        innerWrapper.appendChild(bodyDiv);

        // フッター
        const footerDiv = document.createElement('div');
        footerDiv.style.marginTop = '50px';
        footerDiv.style.textAlign = 'center';
        footerDiv.style.color = '#888888';
        footerDiv.style.fontSize = '12px';
        footerDiv.innerText = 'cinnamonclove.com';
        innerWrapper.appendChild(footerDiv);

        // 画面の最前面に被せる
        document.body.appendChild(captureContainer);

        // カメラフラッシュのようなテキスト演出
        const loadingText = document.createElement('div');
        loadingText.innerText = '画像を作成中...';
        loadingText.style.position = 'fixed';
        loadingText.style.top = '20px';
        loadingText.style.right = '20px';
        loadingText.style.background = '#d4af37';
        loadingText.style.color = '#000';
        loadingText.style.padding = '10px 20px';
        loadingText.style.borderRadius = '5px';
        loadingText.style.fontWeight = 'bold';
        loadingText.style.zIndex = '100000';
        captureContainer.appendChild(loadingText);

        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const canvas = await html2canvas(innerWrapper, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                logging: false
            });

            document.body.removeChild(captureContainer);

            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
            return true;
        } catch (err) {
            console.error("画像生成エラー:", err);
            if(captureContainer.parentNode) document.body.removeChild(captureContainer);
            return false;
        }
    }

    function setupActionButtons(userName, birthDate, theme) {
        const copyBtn = document.getElementById("report-save-text-btn");
        const saveImgBtn = document.getElementById("report-save-image-btn");

        if (copyBtn) {
            copyBtn.addEventListener("click", async () => {
                if (!reportData) return;
                const textToCopy = `Spiritual Chart ｜ 霊的カルテ\n\n` +
                    `THEME: ${theme}\n` +
                    (userName && userName !== "あなた" ? `SEEKER: ${userName}\n` : "") +
                    (birthDate ? `BIRTH DATE: ${birthDate}\n` : "") +
                    `\n----------------------------------------\n\n` +
                    reportData.reportText.trim() +
                    `\n\n----------------------------------------\n` +
                    `https://cinnamonclove.com`;

                try {
                    await navigator.clipboard.writeText(textToCopy);
                    alert("霊的カルテのテキストをクリップボードにコピーしたよ！");
                } catch(e) {
                    console.error("Copy error:", e);
                    alert("コピーに失敗しちゃった。ブラウザの権限を確認してみてね。");
                }
            });
        }

        if (saveImgBtn) {
            saveImgBtn.addEventListener("click", async () => {
                const filename = `thoth-spiritual-chart-${new Date().getTime()}.png`;
                await generateAndDownloadReportImage(filename, userName, birthDate, theme);
            });
        }
    }

    // ====================================================
    // 7. その他の基本処理
    // ====================================================
    function showError(message) {
        loadingEl.innerHTML = `
            <div style="color: #e74c3c; font-size: 1.5rem; margin-bottom: 1rem;">🔮</div>
            <p style="color: var(--text-primary); font-size: 0.95rem; line-height: 1.8;">${escapeHtml(message)}</p>
            <a href="index.html" class="report-notice-btn" style="margin-top: 1.5rem; display: inline-block;">リーディングに戻る</a>
        `;
    }

    function escapeHtml(str) {
        if (typeof str !== "string") return str;
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // レスポンシブ切り替え監視
    window.addEventListener("resize", () => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth < 768;

        if (wasMobile !== isMobile) {
            if (!isMobile) {
                // PCモードになったらシートのtransformとドラッグ制限を全解除
                bottomSheet.style.transform = "none";
                contentWrapper.style.overflowY = "auto";
                if (observer) observer.disconnect();
                setTimeout(initScrollObserver, 300); // 監視を再接続
            } else {
                // モバイルモードになったらボトムシート位置を再計算
                updateSheetPositions();
                setSheetState("half");
                initBottomSheetEvents();
            }
        }
    });

    // 初期起動処理
    function init() {
        drawPaths();
        drawAbyss();
        drawSephiroth();

        // 霊的カルテAPIのデータロード
        loadSpiritualReport();

        // モバイル特有のドラッグイベント
        initBottomSheetEvents();
    }

    // DOMContentLoaded で起動
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
