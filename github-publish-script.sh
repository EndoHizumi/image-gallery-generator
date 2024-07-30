#!/bin/bash

# GitHub公開スクリプト for Image Gallery Generator

# エラーが発生したら即座に終了
set -e

# 変数の設定
REPO_NAME="image-gallery-generator"
GITHUB_USERNAME="endohizumi"

# 1. Gitリポジトリの初期化
git init

# 2. .gitignoreファイルの作成
echo "node_modules/" > .gitignore
echo "config.json" >> .gitignore

# 3. package.jsonの作成（存在しない場合）
if [ ! -f package.json ]; then
    npm init -y
fi

# 4. 依存関係のインストール
npm install express sharp --save

# 5. 全ファイルをステージングに追加
git add .

# 6. 初期コミットの作成
git commit -m "Initial commit"

# 7. GitHubリポジトリとの連携
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# 8. GitHubにプッシュ
git push -u origin master

# 9. READMEの更新（必要に応じて）
echo "README has been created. Please update it manually if needed."

echo "Script completed. Please check your GitHub repository at https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "Don't forget to manually add a LICENSE file on GitHub if needed."
