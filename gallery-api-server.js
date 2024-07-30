const express = require("express");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { generateGalleryHTML } = require("./gallery-generator");

const app = express();
const port = 3000;

let config;
try {
  const configFile = fs.readFileSync("config.json", "utf8");
  config = JSON.parse(configFile);
} catch (error) {
  console.error("設定ファイルの読み込みに失敗しました:", error);
  config = { defaultImagePath: "" };
}

function getLocalIpAddress() {
  // ローカルIPアドレスを取得する
  const interfaces = os.networkInterfaces();
  for (let dev in interfaces) {
    const iface = interfaces[dev].find(
      (details) => details.family === "IPv4" && !details.internal
    );
    if (iface) return iface.address;
  }
  return "0.0.0.0";
}

app.get("/gallery", async (req, res) => {
  let directoryPath = req.query.path || config.defaultImagePath;

  if (!directoryPath) {
    return res
      .status(400)
      .send(
        'パスが指定されていません。クエリパラメータ"path"を使用するか、config.jsonでデフォルトパスを設定してください。'
      );
  }

  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Transfer-Encoding": "chunked",
  });

  res.write(`
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background-color: #f0f0f0;
      }
      .progress-container {
        text-align: center;
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      progress {
        width: 100%;
        height: 20px;
      }
    </style>
  </head>
  <body>
    <div class="progress-container">
      <h1>ギャラリーを生成中...</h1>
      <progress id="progress" value="0" max="100"></progress>
      <p id="progress-text">0% 完了 (0 / 0)</p>
    </div>
    <script>
      function updateProgress(completed, total) {
        const progress = (completed / total) * 100;
        document.getElementById('progress').value = progress;
        document.getElementById('progress-text').innerText = 
          progress.toFixed(1) + '% 完了 (' + completed + ' / ' + total + ')';
      }
    </script>
  </body>
  </html>
  `);

  try {
    const html = await generateGalleryHTML(
      directoryPath,
      (completed, total) => {
        res.write(`<script>updateProgress(${completed}, ${total});</script>`);
      }
    );
    res.write('<script>document.body.innerHTML = "";</script>');
    res.write(html);
    res.end();
  } catch (error) {
    console.error("エラーが発生しました:", error);
    res.write("<h2>エラーが発生しました</h2>");
    res.end();
  }
});

app.use("/images/:directoryHash", (req, res, next) => {
  const directoryHash = req.params.directoryHash;
  const imagePath = Object.entries(config).find(
    ([key, value]) => hashDirectory(value) === directoryHash
  )?.[1];
  if (imagePath) {
    express.static(imagePath)(req, res, next);
  } else {
    res.status(404).send("Directory not found");
  }
});
app.use(
  "/thumbnails",
  express.static(path.join(config.defaultImagePath, "thumbnails"))
);

const localIpAddress = getLocalIpAddress();

app.listen(port, "0.0.0.0", () => {
  console.log(`Gallery API サーバーが起動しました`);
  console.log(`ローカルアクセス: http://localhost:${port}/gallery`);
  console.log(`LAN内アクセス: http://${localIpAddress}:${port}/gallery`);
  console.log(
    `デフォルト画像パス: ${config.defaultImagePath || "設定されていません"}`
  );
});
