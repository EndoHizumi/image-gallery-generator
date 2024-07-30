const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");
const crypto = require("crypto");

function hashDirectory(directoryPath) {
  return crypto.createHash("md5").update(directoryPath).digest("hex");
}

async function generateThumbnail(imagePath, thumbnailPath, size = 200) {
  try {
    await fs.access(thumbnailPath);
    return;
  } catch (error) {
    // ファイルが存在しない場合は続行
  }

  await sharp(imagePath, { failOnError: false })
    .resize(size, size, { fit: "inside" })
    .toFile(thumbnailPath);
}

async function generateGalleryHTML(directoryPath, progressCallback) {
  const files = await fs.readdir(directoryPath);
  const imageFiles = files.filter((file) =>
    [".jpg", ".jpeg", ".png", ".gif"].includes(path.extname(file).toLowerCase())
  );

  let html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>画像ギャラリー</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/simplelightbox/2.14.1/simple-lightbox.min.css">
  <style>
    body, html {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      height: 100%;
    }
    .gallery-container {
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 40px;
      width: 100%;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      justify-content: center;
      width: 100%;
    }
    .gallery a {
      display: block;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      position: relative;
      overflow: hidden;
      background-color: #f0f0f0;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    .gallery a:hover {
      transform: scale(1.05);
    }
    .gallery img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .error-message {
      color: red;
      text-align: center;
      margin: 10px 0;
    }
    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 20px;
    }
    @media (max-width: 768px) {
      .gallery {
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }
      .gallery-container {
        padding: 10px;
      }
    }
    @media (max-width: 480px) {
      .gallery {
        grid-template-columns: repeat(2, 1fr);
      }
      .gallery-container {
        padding: 5px;
      }
    }
  </style>
</head>
<body>
  <div class="gallery-container">
    <h1>${directoryPath}</h1>
    <div class="gallery">
`;

  const thumbnailBaseDir = path.join(__dirname, "thumbnails");
  const directoryHash = hashDirectory(directoryPath);
  const thumbnailDir = path.join(thumbnailBaseDir, directoryHash);
  await fs.mkdir(thumbnailDir, { recursive: true });

  let completedCount = 0;
  const totalCount = imageFiles.length;

  const thumbnailPromises = imageFiles.map(async (file, index) => {
    const imagePath = path.join(directoryPath, file);
    const thumbnailPath = path.join(thumbnailDir, `thumb_${file}`);

    try {
      await generateThumbnail(imagePath, thumbnailPath);

      completedCount++;
      if (progressCallback) {
        progressCallback(completedCount, totalCount);
      }

      return `
      <a href="images/${encodeURIComponent(directoryHash)}/${encodeURIComponent(
        file
      )}" class="lightbox">
        <img src="thumbnails/${encodeURIComponent(
          directoryHash
        )}/${encodeURIComponent(`thumb_${file}`)}" alt="${file}">
      </a>
    `;
    } catch (error) {
      console.error(`画像処理エラー (${file}):`, error.message);
      completedCount++;
      if (progressCallback) {
        progressCallback(completedCount, totalCount);
      }
      return `
      <div class="error-message">
        画像の読み込みに失敗しました: ${file}
      </div>
    `;
    }
  });

  const thumbnailResults = await Promise.all(thumbnailPromises);
  html += thumbnailResults.join("");

  html += `
    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/simplelightbox/2.14.1/simple-lightbox.min.js"></script>
  <script>
    window.onload = function() {
      window.scrollTo(0, 0);
      new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
        animationSpeed: 250,
        swipeClose: true,
        showCounter: false,
      });
    };
  </script>
</body>
</html>
`;

  return html;
}

module.exports = { generateGalleryHTML, hashDirectory };
