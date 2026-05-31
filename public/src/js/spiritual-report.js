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

    // --- 言語設定の初期化 ---
    const savedLang = localStorage.getItem('tarot_lang');
    const browserLang = navigator.language || navigator.userLanguage || 'ja';
    window.currentLang = savedLang || (browserLang.startsWith('ja') ? 'ja' : 'en');
    let isEn = window.currentLang === 'en';

    // カバラ要素のキーワードマッピング（スクロール連動ハイライト用）
    const SEPHIRA_KEYWORDS = {
        "kether": ["ケテル", "kether"], "chokmah": ["コクマー", "chokmah"], "binah": ["ビナー", "binah"],
        "chesed": ["ケセド", "chesed"], "geburah": ["ゲブラー", "geburah"], "tiphareth": ["ティファレト", "tiphareth"],
        "netzach": ["ネツァク", "netzach"], "hod": ["ホド", "hod"], "yesod": ["イェソド", "yesod"], "malkuth": ["マルクト", "malkuth"], "daath": ["ダアト", "daath"]
    };

    const PATH_KEYWORDS = {
        11: ["愚者", "fool"], 12: ["魔術師", "magus"], 13: ["女教皇", "priestess"], 14: ["女帝", "empress"], 15: ["星", "star"], 16: ["神官", "hierophant"],
        17: ["恋人", "lovers"], 18: ["戦車", "chariot"], 19: ["欲望", "lust"], 20: ["隠者", "hermit"], 21: ["運命", "fortune"], 22: ["調整", "adjustment"],
        23: ["吊るされた男", "hanged"], 24: ["死神", "death"], 25: ["術", "art"], 26: ["悪魔", "devil"], 27: ["塔", "tower"],
        28: ["皇帝", "emperor"], 29: ["月", "moon"], 30: ["太陽", "sun"], 31: ["永劫", "aeon"], 32: ["宇宙", "universe"]
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

            // グループコンテナ
            const group = createSvgElement("g", {
                class: "path-group"
            });

            // 見える細い線
            const line = createSvgElement("line", {
                x1: from.x, y1: from.y,
                x2: to.x, y2: to.y,
                class: "tree-path",
                "data-path-number": path.number
            });
            group.appendChild(line);

            // 当たり判定用の太い透明な線（幅20px）
            const hitbox = createSvgElement("line", {
                x1: from.x, y1: from.y,
                x2: to.x, y2: to.y,
                stroke: "transparent",
                "stroke-width": "20",
                fill: "none",
                cursor: "pointer"
            });
            group.appendChild(hitbox);

            // クリックイベントのバインド
            group.addEventListener("click", () => scrollToKabbalahElement("path", path.number));
            pathsLayer.appendChild(group);

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
                y: coords.y - 5,
                class: "sephira-number"
            });
            numText.textContent = sephira.number;
            group.appendChild(numText);

            // 英語名
            const nameEn = createSvgElement("text", {
                x: coords.x,
                y: coords.y + 13,
                class: "sephira-name-en"
            });
            nameEn.textContent = sephira.name.en;
            group.appendChild(nameEn);

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
            showError(isEn ? "No recent reading result found. Please perform a reading first." : "最新のリーディング結果が見つかりません。まずはリーディングを行ってください。");
            return;
        }

        try {
            const readingData = JSON.parse(recentReadingStr);
            const cards = readingData.cards;
            const userName = readingData.userName || "";
            const birthDate = readingData.birthDate || "";
            const theme = readingData.theme || (isEn ? "General Reading" : "総合リーディング");

            if (!cards || cards.length === 0) {
                showError(isEn ? "No card data found in the reading." : "リーディング結果にカードデータが含まれていません。");
                return;
            }

            // 同一リーディングを識別するための一意キーを作成（タイムスタンプまたはカード構成）
            const readingKey = (readingData.timestamp || 
                (cards.map(c => c.id).join("-") + "_" + userName + "_" + birthDate + "_" + theme)) + "_" + window.currentLang;

            // --- 1. キャッシュの確認 ---
            const cacheStr = localStorage.getItem("thoth_tarot_report_cache");
            let cacheData = null;
            if (cacheStr) {
                try {
                    cacheData = JSON.parse(cacheStr);
                } catch (e) {
                    console.error("Cache parse error", e);
                }
            }


            // キャッシュがヒットした場合、APIを叩かずに即時レンダリング
            if (cacheData && cacheData.readingKey === readingKey) {
                console.log("Serving spiritual report from local cache (API saved!)");
                reportData = cacheData.reportData;
                
                activatedSephiroth = reportData.activatedSephiroth || [];
                activatedPaths = reportData.activatedPaths || [];

                // メタ情報の表示（キャッシュされた時点、または現在のカウント）
                renderMetaInfo(userName, birthDate, theme);

                // 生命の樹をハイライト
                highlightActivatedElements();

                // レポート文のレンダリング
                renderReportBody(reportData.reportText);

                // ローディングを隠して本文を表示
                loadingEl.classList.add("hidden-section");
                loadingEl.style.display = "none";
                textContainer.classList.remove("hidden-section");

                updateSheetPositions();
                if (isMobile) {
                    setSheetState("half");
                }

                setupActionButtons(userName, birthDate, theme);

                setTimeout(() => {
                    highlightActivatedElements();
                    initScrollObserver();
                }, 300);
                return;
            }

            // メタ情報の表示（新規生成前）
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
                language: window.currentLang
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

            // --- 3. 成功時にキャッシュ保存 ---
            const newCache = {
                readingKey: readingKey,
                reportData: reportData
            };
            localStorage.setItem("thoth_tarot_report_cache", JSON.stringify(newCache));

            // メタ情報の再表示
            renderMetaInfo(userName, birthDate, theme);

            // APIデータに基づいて生命の樹をハイライト
            highlightActivatedElements();

            // レポート文のパースとレンダリング
            renderReportBody(reportData.reportText);

            // ローディングを隠して本文を表示
            loadingEl.classList.add("hidden-section");
            loadingEl.style.display = "none";
            textContainer.classList.remove("hidden-section");

            // レレスポンシブに応じた初期展開状態のセット
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
        if (name && name !== "あなた" && name !== "You") {
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
            const isHeading = /^[1-3]\.\s+/.test(trimmed) || trimmed.startsWith("霊的カルテ") || trimmed.startsWith("Spiritual Chart");
            
            if (isHeading) {
                let idAttr = "";
                if (trimmed.includes("1.") || trimmed.includes("現在地") || trimmed.includes("Location")) idAttr = 'id="section-sephiroth"';
                else if (trimmed.includes("2.") || trimmed.includes("変容") || trimmed.includes("Transformation")) idAttr = 'id="section-paths"';
                else if (trimmed.includes("3.") || trimmed.includes("作業") || trimmed.includes("Guidance") || trimmed.includes("Work")) idAttr = 'id="section-guidance"';

                html += `<h3 class="report-section-header" ${idAttr}>${escapeHtml(trimmed)}</h3>`;
            } else {
                // 段落テキスト
                // スクロール連動用に、この段落が言及しているカバラ要素を分析
                let targetAttr = "";
                
                // セフィラのチェック
                for (const [key, keywords] of Object.entries(SEPHIRA_KEYWORDS)) {
                    if (keywords.some(kw => trimmed.toLowerCase().includes(kw.toLowerCase()))) {
                        targetAttr = `data-sephira-target="${key}"`;
                        break;
                    }
                }
                
                // パスのチェック（セフィラが含まれていない場合のみ）
                if (!targetAttr) {
                    for (const [num, keywords] of Object.entries(PATH_KEYWORDS)) {
                        if (keywords.some(kw => trimmed.toLowerCase().includes(kw.toLowerCase()))) {
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

    function setupActionButtons(userName, birthDate, theme) {
        const copyBtn = document.getElementById("report-save-text-btn");

        if (copyBtn) {
            copyBtn.addEventListener("click", async () => {
                if (!reportData) return;
                
                // Markdown記号（#や*）を除去し、プレーンテキストに整形
                let cleanText = reportData.reportText.trim()
                    .replace(/#/g, '')
                    .replace(/\*\*/g, '')
                    .replace(/\*/g, '');

                const textToCopy = `【Spiritual Chart ｜ 霊的カルテ】\n\n` +
                    `THEME: ${theme}\n` +
                    (userName && userName !== "あなた" ? `SEEKER: ${userName}\n` : "") +
                    (birthDate ? `BIRTH DATE: ${birthDate}\n` : "") +
                    `\n----------------------------------------\n\n` +
                    cleanText +
                    `\n\n----------------------------------------\n` +
                    `https://cinnamonclove.com`;

                try {
                    await navigator.clipboard.writeText(textToCopy);
                    alert("霊的カルテのテキストをクリップボードにコピーしたよ！\nSNSなどにそのまま貼り付けてシェアできます。");
                } catch(e) {
                    console.error("Copy error:", e);
                    alert("コピーに失敗しちゃった。ブラウザの権限を確認してみてね。");
                }
            });
        }
    }

    // ====================================================
    // 7. その他の基本処理
    // ====================================================
    function showError(message) {
        const formattedMessage = escapeHtml(message).replace(/\n/g, "<br>");
        loadingEl.innerHTML = `
            <div style="color: #e74c3c; font-size: 1.5rem; margin-bottom: 1rem;">🔮</div>
            <p style="color: var(--text-primary); font-size: 0.95rem; line-height: 1.8; white-space: normal;">${formattedMessage}</p>
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

    function updateStaticUiText() {
        document.title = isEn ? "Spiritual Chart | Personal AI Report ── Thoth Tarot" : "霊的カルテ ｜ パーソナル・AIレポート ── トート・タロット";
        const backLink = document.getElementById("back-link");
        if (backLink) backLink.textContent = isEn ? "← Back to Reading" : "← リーディングに戻る";
        
        const reportTitle = document.querySelector(".report-title");
        if (reportTitle) reportTitle.textContent = "Spiritual Chart";
        const reportSubtitle = document.querySelector(".report-subtitle");
        if (reportSubtitle) reportSubtitle.textContent = isEn ? "Spiritual Chart | Activation State" : "霊的カルテ ｜ 生命の樹の活性状態";

        const loadingText = document.querySelector(".loading-text");
        if (loadingText) loadingText.textContent = isEn ? "Tracing the steps of the soul, verifying True Will..." : "魂の階梯を辿り、真の意志を照合しています...";

        const saveTxtBtn = document.getElementById("report-save-text-btn");
        if (saveTxtBtn) saveTxtBtn.textContent = isEn ? "Copy as Text" : "結果を文章でコピー";

        const toggleBtn = document.getElementById("lang-toggle-btn");
        if (toggleBtn) toggleBtn.textContent = isEn ? "JP" : "EN";
    }

    function switchLang() {
        window.currentLang = window.currentLang === 'ja' ? 'en' : 'ja';
        isEn = window.currentLang === 'en';
        localStorage.setItem('tarot_lang', window.currentLang);
        updateStaticUiText();
        
        // 言語が変わったのでカルテを再読み込み（ローディング表示）
        loadingEl.classList.remove("hidden-section");
        loadingEl.style.display = "flex";
        textContainer.classList.add("hidden-section");
        resetSvgStyles();
        
        loadSpiritualReport();
    }

    // 初期起動処理
    function init() {
        updateStaticUiText();
        drawPaths();
        drawAbyss();
        drawSephiroth();

        const langToggleBtn = document.getElementById('lang-toggle-btn');
        if (langToggleBtn) langToggleBtn.addEventListener('click', switchLang);

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
