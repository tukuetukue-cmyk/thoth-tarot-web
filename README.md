# Thoth Tarot プロジェクト

## 概要

このリポジトリは、トート・タロット（Thoth Tarot）デッキの情報をデジタル化し、API と Web インターフェースを提供するプロジェクトです。占星術・カバラ・タロットの深遠なシンボリズムを活かし、モダンなウェブ体験と高品質なデータ提供を目指しています。

## 主な機能

- **API**: タロットカード情報、リーディング、データ検索を提供する RESTful API (`thoth-tarot-api`)
- **Web アプリ**: カード閲覧・リーディング体験を提供するフロントエンド (`thoth-tarot-web`)
- **多言語対応**: 日本語・英語をはじめとした多言語サポート
- **プレミアムデザイン**: ダークモード、グラスモーフィズム、マイクロアニメーションを駆使した UI

## セットアップ手順

```bash
# 必要なツール
# - Python 3.11
# - pip

# リポジトリをクローン
git clone https://github.com/your-org/thoth-tarot-project.git
cd thoth-tarot-project

# API サーバーのセットアップ
cd thoth-tarot-api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# .env に GEMINI_API_KEY 等を設定
uvicorn main:app --reload  # => http://localhost:8000

# Web フロントエンドのセットアップ（静的ファイル）
cd ../thoth-tarot-web
# ローカルで確認する場合
python -m http.server 8080 --directory public  # => http://localhost:8080
# 本番デプロイは Firebase Hosting
# firebase deploy --only hosting
```

## 使用方法

- API エンドポイントは `http://localhost:8000/api/...` にあります。
- Web アプリは Firebase Hosting（`https://cinnamonclove.com`）または ローカルサーバーでカード閲覧やリーディングが可能です。

## 開発ガイドライン

- コーディング規約は `AGENTS.md` に記載。
- 日本語コメントを必ず使用してください。
- 変更は必ず Git で管理し、プルリクエストを通じてレビューしてください。

## ライセンス

MIT License. 詳細は `LICENSE` ファイルをご参照ください。

## 連絡先

質問や提案は GitHub Issues か、メール `contact@cinnamonclove.com` までお願いします。
