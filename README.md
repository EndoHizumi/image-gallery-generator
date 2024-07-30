# Image Gallery Generator

このプロジェクトは、指定されたディレクトリ内の画像ファイルから HTML ギャラリーを動的に生成する Node.js アプリケーションです。ローカルネットワーク内でアクセス可能なウェブサーバーとして機能し、画像のサムネイルを生成し、lightbox ビューアーを使用して画像を表示します。

## 主な機能

- 指定ディレクトリ内の画像ファイルを自動検出
- サムネイル画像の自動生成
- レスポンシブな HTML ギャラリーの生成
- Lightbox を使用した画像ビューア
- ローカルネットワーク内でのアクセス
- リアルタイムの処理進捗表示
- スマートフォンでの 2 列表示対応

## 必要条件

- Node.js (バージョン 12 以上推奨)
- npm (Node.js に付属)

## セットアップ

1. このリポジトリをクローンまたはダウンロードします：

   ```bash
   git clone https://github.com/yourusername/image-gallery-generator.git
   ```

2. プロジェクトディレクトリに移動します：

   ```bash
   cd image-gallery-generator
   ```

3. 必要な依存関係をインストールします：

   ```bash
   npm install
   ```

4. `config.json` ファイルを作成し、デフォルトの画像ディレクトリを設定します：

   ```json
   {
     "defaultImagePath": "/path/to/your/image/directory"
   }
   ```

## 使用方法

1. サーバーを起動します：

   ```bash
   npm run start
   ```

2. ブラウザで以下の URL にアクセスします：

   - ローカルアクセス: `http://localhost:3000/gallery`
   - LAN 内アクセス: `http://<your-local-ip>:3000/gallery`

3. カスタムディレクトリを指定する場合は、URL にクエリパラメータを追加します：

   ```bash
   http://localhost:3000/gallery?path=/custom/path/to/images
   ```

## カスタマイズ

- `gallery-generator.js`: ギャラリーの HTML 生成ロジックを含みます。
- `gallery-api-server.js`: Express.js を使用した Web サーバーの設定を含みます。

## 貢献

プルリクエストは歓迎します。大きな変更を加える場合は、まず issue を開いて変更内容について議論してください。

## ライセンス

[MIT](https://choosealicense.com/licenses/mit/)
