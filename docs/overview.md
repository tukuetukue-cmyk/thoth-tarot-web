# Overview

Thoth Tarot プロジェクトは、トート・タロットのカード情報・シンボリズムをデジタル化し、FastAPI と 静的 HTML/CSS/JavaScript で提供するプロジェクトです。占星術、カバラ、錬金術などの深遠な象徴体系を活かし、マルチリンガルで高品質なリーディング体験を実現します。

## 主なコンポーネント

- **thoth-tarot-api**: RESTful API サーバー (FastAPI)。カードデータ、リーディングロジック、検索エンドポイントを提供。Python の `requirements.txt` で依存管理。
- **thoth-tarot-web**: 静的フロントエンド (HTML/CSS/JavaScript)。`public/` ディレクトリ配下のファイルで構成。Firebase Hosting でデプロイ。
- **docs/**: 本リポジトリのドキュメント集。セットアップ、API 仕様、開発ガイドラインが含まれます。

## デザイン指針

- ダークモード & グラスモーフィズム
- 微細なマイクロアニメーションでインタラクティブ性を向上
- カスタム Google フォント (Julius Sans One, Noto Serif JP, Noto Sans JP) を使用したタイポグラフィ

---

*このドキュメントは Codex へ引き継ぐ際のプロジェクト概要として活用してください。*
