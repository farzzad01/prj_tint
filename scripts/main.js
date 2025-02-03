import cameraManager from './camera.js';
import filters from './filters.js';
import glassDetector from './glassDetector.js';

class App {
  constructor() {
    this.init();
    this.setupEvents();
  }
  init() {
    window.cameraManager = cameraManager;
    window.filters = filters;
    window.glassDetector = glassDetector;
  }
  setupEvents() {
    document.getElementById('tintSlider').addEventListener('input', (e) => {
      document.getElementById('tintValue').textContent = `${e.target.value}%`;
      filters.setOpacity(e.target.value);
    });
    document.getElementById('effectSelect').addEventListener('change', (e) => {
      filters.setEffect(e.target.value);
    });
    document.getElementById('simulateBtn').addEventListener('click', () => {
      document.body.classList.toggle('simulation-mode');
    });
    document.getElementById('exportBtn').addEventListener('click', async () => {
      const blob = await this.captureImage();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tint-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    });
    document.getElementById('newSession').addEventListener('click', () => {
      glassDetector.reset();
      filters.reset();
      document.body.classList.remove('simulation-mode');
    });
    document.getElementById('selectGlass').addEventListener('click', () => {
      glassDetector.toggleActivation();
    });
    document.getElementById('helpBtn').addEventListener('click', () => {
      this.showTutorial();
    });
  }
  captureImage() {
    return new Promise((resolve) => {
      const video = document.getElementById('cameraFeed');
      const overlay = document.getElementById('overlayCanvas');
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      ctx.drawImage(overlay, 0, 0);
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  }
  showTutorial() {
    const tutorial = document.getElementById('tutorial');
    tutorial.innerHTML = `
      <div class="tutorial-content">
        <h2>راهنما</h2>
        <p>برای انتخاب ناحیه شیشه روی تصویر کلیک کنید و با کشیدن موس، ناحیه مورد نظر را انتخاب کنید. سپس میزان تینت و افکت را تنظیم نمایید.</p>
        <button id="closeTutorial" class="btn">بستن</button>
      </div>
    `;
    tutorial.classList.remove('hidden');
    document.getElementById('closeTutorial').addEventListener('click', () => {
      tutorial.classList.add('hidden');
    });
  }
}
new App();
