# Image Gallery Generator

このプロジェクトは、指定されたディレクトリ内の画像ファイルからHTMLギャラリーを動的に生成するNode.jsアプリケーションです。ローカルネットワーク内でアクセス可能なウェブサーバーとして機能し、画像のサムネイルを生成し、lightboxビューアーを使用して画像を表示します。

## 主な機能

- 指定ディレクトリ内の画像ファイルを自動検出
- サムネイル画像の自動生成
- レスポンシブなHTMLギャラリーの生成
- Lightboxを使用した画像ビューア
- ローカルネットワーク内でのアクセス
- リアルタイムの処理進捗表示
- スマートフォンでの2列表示対応

## 必要条件

- Node.js (バージョン12以上推奨)
- npm (Node.jsに付属)

## セットアップ

1. このリポジトリをクローンまたはダウンロードします：
   ```
   git clone https://github.com/yourusername/image-gallery-generator.git
   ```

2. プロジェクトディレクトリに移動します：
   ```
   cd image-gallery-generator
   ```

3. 必要な依存関係をインストールします：
   ```
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
   ```
   node gallery-api-server.js
   ```

2. ブラウザで以下のURLにアクセスします：
   - ローカルアクセス: `http://localhost:3000/gallery`
   - LAN内アクセス: `http://<your-local-ip>:3000/gallery`

3. カスタムディレクトリを指定する場合は、URLにクエリパラメータを追加します：
   ```
   http://localhost:3000/gallery?path=/custom/path/to/images
   ```

## カスタマイズ

- `gallery-generator.js`: ギャラリーのHTML生成ロジックを含みます。
- `gallery-api-server.js`: Express.jsを使用したWebサーバーの設定を含みます。

## 貢献

プルリクエストは歓迎します。大きな変更を加える場合は、まずissueを開いて変更内容について議論してください。

## ライセンス

[MIT](https://choosealicense.com/licenses/mit/)
