# Thoth Tarot Web

## 概要

トート・タロット占いサイト（cinnamonclove.com）の静的フロントエンド・リポジトリです。
ダークモード、グラスモーフィズム、SVGによる生命の樹描画を用いたプレミアムなUI/UXを提供します。
バックエンド（FastAPI / Gemini API）は別のリポジトリ（`thoth-tarot-api`）で管理されています。

## 主な機能

- **リーディングUI**: アニメーション付きのカード展開
- **セフィロトUI**: 生命の樹をSVGで描画したインタラクティブ画面
- **霊的カルテ**: ユーザー状況に応じた長文解説の表示
- **多言語対応**: 日本語（JP）/ 英語（EN）の部分的な切り替え

## セットアップ手順

```bash
# リポジトリをクローン
git clone https://github.com/tukuetukue-cmyk/thoth-tarot-web.git
cd thoth-tarot-web

# ローカルサーバー起動 (例: Pythonモジュールを使用)
cd public
python3 -m http.server 3000
```
ブラウザで `http://localhost:3000` にアクセスしてください。

## 開発ガイドライン

- コーディング規約は `AGENTS.md` に記載。
- 日本語コメントを必ず使用すること。
- UI設計・要件については `docs/DESIGN.md` を参照。

## ドキュメント

`docs/` ディレクトリに詳細な技術ドキュメントを格納しています。
詳細は [docs/README.md](docs/README.md) を参照してください。
