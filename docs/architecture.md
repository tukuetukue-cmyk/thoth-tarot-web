# Architecture (Frontend)

## コンポーネント構成

- **thoth-tarot-web** (本リポジトリ)
  - 静的 HTML/CSS/JavaScript（ビルドツール不使用）。
  - `public/` ディレクトリ配下に `index.html`, `src/css/`, `src/js/` 等を配置。
  - Firebase Hosting (`.firebaserc` プロジェクト: `cinnamonclove-7be76`) を使用し、`firebase.json` で `public/` を公開対象に設定。
- **外部サービス連携**
  - **Firebase**: Authentication, Firestore, Premium 関連の機能コードが存在しますが、現状は未完成または休眠状態です。
  - **バックエンド API (`thoth-tarot-api`)**: 本番 API の URL は `https://thoth-tarot-api.onrender.com` です。

## API 連携と接続先の仕様

- **通常のリーディング / チャット / 振り返り**: 
  ローカル環境（`localhost`）で実行中であっても、常に本番 API (`https://thoth-tarot-api.onrender.com`) へ接続します。
- **霊的カルテ**: 
  ローカル環境（`localhost`）実行時のみ、`http://localhost:8000` へ接続するように分岐されています。

*(※APIの接続先を環境ごとにどのように切り替えるべきかは、今後の要確認事項です)*

## フロントエンドとバックエンドの責任分界

- **フロントエンド (`thoth-tarot-web`)**
  - ユーザー入力の受け付け、`localStorage` によるデータ保持（ユーザー名、生年月日、履歴など）
  - アニメーション、グラスモーフィズム、SVG による UI 描画
  - 1日3回のリーディング制限の判定（クライアント側のみ）
  - APIへのリクエスト送信と、結果の DOM マッピング
- **バックエンド (`thoth-tarot-api` / 別リポジトリ)**
  - 生年月日から太陽星座・エレメントの計算
  - 複数カード間のディグニティ（相性）計算
  - Gemini API との通信、プロンプト組み立て、エラー・リトライ処理
  - カードデータ (`tarot_data.json`) の正本保持 *(※カードデータ正本の持ち方は要確認事項)*
