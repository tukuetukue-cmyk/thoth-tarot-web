# PROJECT_MEMORY.md

## プロジェクトの永続的記憶

このファイルは **Codex** へ引き継ぐ際に、プロジェクト全体の重要情報・前提条件・設定値を一元管理するためのメモリです。実装やデバッグ時に **AI（ハル）** が参照すべき情報をまとめています。

### 1. 環境変数・シークレット
- `GEMINI_API_KEY` – Gemini API の認証キー（必須）。本リポジトリには **記載しないこと**。
- `STRIPE_SECRET_KEY` – Stripe のシークレットキー（現在はコメントアウト）。
- `SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY` – Supabase 接続情報（同上）。
- `.env` ファイルで `dotenv.load_dotenv()` が呼び出され、上記変数がロードされます。

### 2. データファイル
- `tarot_data.json` – メジャー・マイナーカードと属性（カバラ、占星術、錬金術、易経）を保持。`main.py` でロードし `CARD_LOOKUP` を構築しています。
- `PROJECT_CONTEXT.md` – AI の行動規範・インフラ前提・デザインルールが記載された「外部記憶」。
- `project_log.md` – 開発履歴・重要な決定事項のタイムライン。

### 3. コード上の重要ロジック
- **太陽星座計算**: `get_sun_sign_and_element`（`main.py` 行 34‑78）で誕生日から星座とエレメントを取得し、プロンプトに組み込みます。
- **Gemini 呼び出し**: `client.models.generate_content`（`main.py` 行 181‑197）で `system_instruction` とユーザー入力を渡し、`max_retries = 3` のリトライロジックがあります。
- **エラーハンドリング**: 429/リソース制限は HTTP 429、空レスポンスは HTTP 503 で返却。

### 4. デプロイ・実行手順（概要）
1. `.env` に必須変数を設定。
2. `pip install -r requirements.txt`（Python 3.x）
3. ローカル開発: `uvicorn main:app --reload`
4. 本番デプロイ例: Firebase Hosting + Cloud Run、`firebase deploy --only hosting`
5. 無料枠のレートリミット（15 RPM, 1500 RPD）に達した場合は、ユーザーへ優しい待機メッセージを返す設計です。

### 5. 既知の制限・注意点
- **1日3回のリーディング制限**（ローカルテスト時はバイパス可）
- **絵文字禁止**、マークダウン装飾 (`##`, `**`) は使用しない
- **外部サービスはコメントアウト** されているため、有効化する際はコードと `.env` を同時に更新する必要があります。

> **重要**: 本メモリはコード変更を伴いません。Codex が正確にプロジェクトを再現できるよう、上記情報を必ず参照してください。
