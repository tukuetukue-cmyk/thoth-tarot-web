# MIGRATION_NOTES.md

## 現在のプロジェクトの状態
- **リポジトリ**: `/Users/tukue/.gemini/antigravity/scratch/thoth_tarot_project`
- **主要コンポーネント**
  - `thoth-tarot-api/`: FastAPI サーバー。Gemini (gemini-3.6‑flash) を呼び出すエンドポイント `/api/chat`, `/api/read` などを提供。
  - `thoth-tarot-web/`: フロントエンド（HTML/CSS/JavaScript）で API と通信し、カードスプレッド UI を実装。
  - `local_tools/`: 仮想環境 (`venv`) と依存パッケージ (FastAPI, google‑genai, pydantic など)。
- **環境変数** (`.env` でロード):
  - `GEMINI_API_KEY` – Gemini API の認証キー。
  - `STRIPE_SECRET_KEY` – Stripe（現在はコメントアウトで無効化）。
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` – Supabase 連携用。
  - `PORT` – ローカル実行時のポート番号（デフォルト 8000）。
- **外部サービス**
  - **Gemini**: テキスト生成の中心エンジン。
  - **Supabase**: データ保存・認証（コード上でクライアント生成のみ、具体的なクエリは未実装）。
  - **Stripe**: 決済機能はコード上に残るが、`# --- Stripe審査落ちのため一時的に無効化 ---` により全てコメントアウト。
  - **Gumroad**（`/api/verify-license`）: ライセンス検証のモック実装。

## 主要なファイル・ディレクトリ
- `thoth-tarot-api/main.py` – エントリーポイント。プロンプト組み立て、Gemini 呼び出し、エラーハンドリングを全て実装。
- `thoth-tarot-api/tarot_data.json` – カードデータ、エゾテリック属性（Kabbalah, Astrology, Alchemy, I‑Ching）を保持。
- `thoth-tarot-api/requirements.txt` – `stripe` など外部依存が記載。
- `thoth-tarot-web/` – フロントエンド静的リソース（HTML, CSS, JS）。
- `PROJECT_CONTEXT.md` – プロジェクト概要・実装方針が記載。（当ファイルの情報は参照元として利用）
- `AI_GUIDELINES.md` – AI のプロンプト指針（日本語コメント必須、マークダウン装飾禁止など）。
- `.env.example`（存在すれば）: 必要な環境変数のテンプレート。

## 開発・運用上の注意点
- **Gemini API キーが未設定** になると全エンドポイントで 500 エラー (`Gemini API Key is not set.`)。デプロイ前に必ず環境変数を設定してください。
- **Stripe のコードはコメントアウト** されているため、決済関連エンドポイントは存在しません。将来的に有効化する場合は、`requirements.txt` の依存と `STRIPE_SECRET_KEY` の設定が必要です。
- **Supabase クライアントは生成されるだけ** で実際の CRUD は実装されていません。Supabase を本番利用する際は、`supabase` パッケージの呼び出しを追加し、テーブルスキーマを整備してください。
- **リトライロジック** は Gemini API 呼び出し時に最大 3 回まで再試行しますが、`429`（レートリミット）時は即座に 429 エラーを返します。レートリミット回避のため、バックエンド側でキャッシュや呼び出し頻度制御を検討してください。
- **安全設定** は全て `BLOCK_NONE` に設定されており、ヘイトスピーチ等のフィルタリングは外部で行う想定です。必要に応じて `safety_settings` の閾値を調整してください。
- **デバッグ情報** は標準出力 (`print`) に出力されます。プロダクション環境ではロガーに置き換えることを推奨します。

## コードから分かりにくい実装
- **_cosmic_seed** の生成ロジック（`_HARMONIC_BALANCE` を掛けた Unix 時間）: 現在は乱数シードとしてだけ使用し、実際のシャッフルには影響しません。将来的にカードのランダム性を制御したい場合は、ロジックを明示的に実装する必要があります。
- **`get_sun_sign_and_element`** のエラー処理は `None` を返すだけで、呼び出し側での `None` 判定が不足しています。実際に `birth_date` が不正な場合、システムプロンプトに星座情報が欠落したまま送信されます。
- **`reflect_reading`** エンドポイントは日本語/英語のシステム指示を分岐させていますが、戻り値は `response.text` のみで、エラー時の詳細は失われます。

## 外部サービスや API との依存関係
- **Gemini**: `google.genai` ライブラリ (`genai.Client`) を使用。モデルは `'gemini-3.6-flash'` がハードコード。
- **Supabase**: `supabase.create_client` が呼び出されますが、実際のテーブル操作は未実装。
- **Stripe**: `stripe` パッケージはインポートされ、`stripe.api_key` が設定されますが、エンドポイントは全てコメントアウト。
- **Gumroad**: ライセンス検証はモック実装 (`THOTH-` プレフィックスで判定)。実際の HTTP 呼び出しはコメント化。

## Antigravity で開発する際に必要だった前提知識
- **Python 3.11** と `venv` 環境。依存は `requirements.txt` から `pip install -r requirements.txt` でインストール。
- **FastAPI** と **uvicorn** の起動方法 (`uvicorn main:app --host 0.0.0.0 --port $PORT`)。
- **Google Gemini API** の認証フローと `genai` ライブラリの使用方法。
- **環境変数管理** (`dotenv` による `.env` の自動ロード)。
- **日本語コメント・コーディング規約**：すべてのコメントは日本語、マークダウン装飾禁止、`Love is the law, love under will.` を必ず結語に含める。

## 今後 Codex が変更する際に注意すべき箇所
- **Stripe 無効化のコメント** を外す場合、`requirements.txt` の依存が正しくインストールされていることを確認し、エンドポイント実装を追加する必要があります。
- **Supabase のデータ操作** を本格化する際は、スキーマ定義、認証フロー、エラーハンドリングを追加してください。
- **Gemini の安全設定** を変更する場合、`genai_types.SafetySetting` の閾値を適切に設定し、テスト環境で動作確認を行うこと。
- **リトライロジック** の上限回数や待機時間 (`time.sleep`) を調整するとレートリミット回避に影響します。
- **環境変数名** を変更すると、`load_dotenv()` のロード対象が変わり、サーバー起動時にキー未設定エラーが発生します。必ず `.env` とコード側のキー名を一致させてください。
- **プロンプトテンプレート** が長くハードコーディングされているため、変更時は文字列全体の構造（システム指示、ユーザー情報、カード情報）を注意深く確認してください。

## 現時点で不明な点・確認が必要な点
- **Supabase の具体的なテーブル構造** やデータ保存方式がコード上に示されていません。実装が必要かどうか、または別途バックエンドで管理されているかを確認してください。
- **Stripe の再有効化スケジュール** と、決済フローに必要なフロントエンド実装が未確定です。再利用する場合は、フロント側の Checkout 呼び出しや webhook の実装が必要です。
- **デプロイ環境**（Render、Firebase など）の具体的な設定ファイル（`render.yaml` など）がリポジトリに存在しません。デプロイ手順を確定するために、インフラ側の設定情報を取得してください。
- **ロギング・モニタリング** の方針がコード中に記載されていません。運用時にエラーログを外部サービスへ送信するかどうかを検討してください。

---
*このドキュメントは Codex へプロジェクトを引き継ぐ際のマイグレーション情報です。実装や設定の変更が必要になる場合は、上記項目を参照しながら慎重に作業してください。*
