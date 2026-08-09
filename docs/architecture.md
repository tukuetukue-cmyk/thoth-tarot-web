# Architecture (Frontend)

## コンポーネント構成

- **thoth-tarot-web** (本リポジトリ)
  - 静的 HTML/CSS/JavaScript（ビルドツール不使用）。
  - Firebase Hosting (`.firebaserc` プロジェクト: `cinnamonclove-7be76`) を使用し、`firebase.json` で `public/` を公開。
  - **カードデータ**: Web側には `public/src/js/cards.js` として78枚のカードデータが存在し、カード抽選・名称・キーワード・象徴・画像対応に利用されています。
- **外部サービス連携**
  - **バックエンド API (`thoth-tarot-api`)**: 本番 API の URL は `https://thoth-tarot-api.onrender.com` です。
  - API 側にも `tarot_data.json` が存在しており、どちらが正本かは現在未確定です。

## API 連携と接続先の仕様

- **通常のリーディング / チャット / 振り返り**: 
  ローカル環境（`localhost`）であっても、常に本番 API (`https://thoth-tarot-api.onrender.com`) へ接続します。
- **霊的カルテ**: 
  ローカル環境（`localhost`）実行時のみ、`http://localhost:8000` へ接続するように分岐されています。

## フロントエンドとバックエンドの責任分界

- **フロントエンド (`thoth-tarot-web`)**
  - ユーザー入力の受け付け、`localStorage` によるデータ保持（ユーザー名、生年月日、履歴など）
  - アニメーション、グラスモーフィズム、SVG による UI 描画
  - 1日3回のリーディング制限の判定（クライアント側のみ）
  - 1枚引きのUI表示（3枚引き処理はコード上残っていますがUIでは休眠状態です）
- **バックエンド (`thoth-tarot-api` / 別リポジトリ)**
  - 生年月日から太陽星座・エレメントの計算
  - ディグニティ（相性）計算（現在のWeb通常UIは1枚引きのみ公開されているため、UIで利用されているとは断定できません）
  - Gemini API との通信、プロンプト組み立て、エラー・リトライ処理
