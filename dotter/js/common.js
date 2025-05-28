
    const upload = document.getElementById('upload');
    const dotSizeSelect = document.getElementById('dotSize');
    const originalCanvas = document.getElementById('original');
    const convertedCanvas = document.getElementById('converted');
    const slider = document.getElementById('slider');
    const downloadBtn = document.getElementById('download');

    const originalCtx = originalCanvas.getContext('2d');
    const convertedCtx = convertedCanvas.getContext('2d');
    let currentImage = null;

    function reduceColors(imageData, colorSteps = 4) {
      const data = imageData.data;
      const step = 255 / (colorSteps - 1);
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.round(data[i] / step) * step;
        data[i + 1] = Math.round(data[i + 1] / step) * step;
        data[i + 2] = Math.round(data[i + 2] / step) * step;
      }
      return imageData;
    }

    // ゲームボーイ風配色サンプル
    function gameboyPalette(imageData) {
      const data = imageData.data;
      const palette = [
        [15, 56, 15],
        [48, 98, 48],
        [139, 172, 15],
        [155, 188, 15],
      ];

      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const level = Math.floor((avg / 256) * palette.length);
        const [r, g, b] = palette[Math.min(level, palette.length - 1)];
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
     }
     return imageData;
    }

    function renderImages(img, dotSize) {
      // 元画像描画
      originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
      originalCtx.drawImage(img, 0, 0, originalCanvas.width, originalCanvas.height);

      // ドット画像描画
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = dotSize;
      tempCanvas.height = dotSize;
      const tempCtx = tempCanvas.getContext('2d');

      tempCtx.drawImage(img, 0, 0, dotSize, dotSize);
      let imgData = tempCtx.getImageData(0, 0, dotSize, dotSize);
      imgData = reduceColors(imgData, 5);
      tempCtx.putImageData(imgData, 0, 0);

      // ドット画像描画
      convertedCtx.clearRect(0, 0, convertedCanvas.width, convertedCanvas.height);

      // 背景を白で塗る
      convertedCtx.fillStyle = '#FFF';
      convertedCtx.fillRect(0, 0, convertedCanvas.width, convertedCanvas.height);

      // 描画処理
      convertedCtx.imageSmoothingEnabled = false;
      convertedCtx.drawImage(tempCanvas, 0, 0, convertedCanvas.width, convertedCanvas.height);
    }

    upload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const img = new Image();
      img.onload = () => {
        currentImage = img;
        const dotSize = parseInt(dotSizeSelect.value);
        renderImages(img, dotSize);
        updateSliderClip(slider.offsetLeft);
      };
      img.src = URL.createObjectURL(file);
    });

    dotSizeSelect.addEventListener('change', () => {
      if (currentImage) {
        const dotSize = parseInt(dotSizeSelect.value);
        renderImages(currentImage, dotSize);
      }
    });

    downloadBtn.addEventListener('click', () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 256;
      tempCanvas.height = 256;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(convertedCanvas, 0, 0, 256, 256);
      const link = document.createElement('a');
      link.download = 'dot-image.png';
      link.href = tempCanvas.toDataURL('image/png');
      link.click();
    });

    // スライダー操作
    let isDragging = false;
    slider.style.left = '0px'; // 初期位置

    function updateSliderClip(x) {
      slider.style.left = `${x}px`;
      convertedCanvas.style.clipPath = `inset(0 0 0 ${x}px)`;
    }

    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
    });
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = convertedCanvas.getBoundingClientRect();
  let x = e.clientX - rect.left;

  // 中心で制限：スライダー幅4pxの半分＝2px
  x = Math.max(0, Math.min(252, x));
  updateSliderClip(x);
});

// 初期ダミー画像の読み込み
window.addEventListener('DOMContentLoaded', () => {
  const dummy = new Image();
  dummy.onload = () => {
    currentImage = dummy;
    const dotSize = parseInt(dotSizeSelect.value);
    renderImages(dummy, dotSize);
    updateSliderClip(128); // スライダー初期位置
  };
  dummy.src = './images/img-dummy.png'; // ← ここを相対パスで指定
});
