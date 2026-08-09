# Architecture

## コンポーネント構成

- **thoth-tarot-api** (`/thoth-tarot-api`)
  - Python 3.11 + FastAPI + uvicorn
  - RESTful エンドポイント (`/api/read`, `/api/chat`, `/api/reflect-reading` 等) でリーディング生成・チャット・振り返り機能を提供
  - カードデータは `tarot_data.json` に JSON 形式で格納され、起動時にメモリ上へロード (`CARD_LOOKUP`)
  - 依存管理は `requirements.txt`（fastapi, uvicorn, pydantic, google-genai, python-dotenv, stripe, supabase）

- **thoth-tarot-web** (`/thoth-tarot-web`)
  - 静的 HTML/CSS/JavaScript（ビルドツール不使用）
  - `public/` ディレクトリ配下に `index.html`, `src/css/`, `src/js/` を配置
  - Firebase Hosting でデプロイ（`firebase.json` で `public/` をルートに指定）
  - UI はダークモード、グラスモーフィズム、マイクロアニメーションで実装

- **docs/**
  - 本リポジトリのドキュメント集
  - Markdown で記述し、Codex へ引き継ぎ時の参照情報として使用

## データフロー

1. **データロード**: API 起動時に `tarot_data.json` を読み込み、`CARD_LOOKUP` としてメモリ上にキャッシュ
2. **API リクエスト**: フロントエンドから `/api/read` 等のエンドポイントへ POST リクエスト
3. **AI 生成**: カードデータ・ユーザー情報・太陽星座計算結果を組み合わせたプロンプトを Gemini API へ送信
4. **レスポンス**: 生成されたリーディングテキストを JSON で返却
5. **フロントエンド表示**: 受け取ったテキストを DOM に挿入し、アニメーション付きで表示

---

*この情報は Codex にプロジェクト全体像を伝えるためのものです。*
