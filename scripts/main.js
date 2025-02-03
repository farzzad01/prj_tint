import cameraManager from './camera.js';
import glassDetector from './glassDetector.js';
import filters from './filters.js';

class TintSimulator {
  constructor() {
    this.isSimulationMode = false;
    this.initializeApp();
  }

  initializeApp() {
    this.setupEventListeners();
    this.setupTutorial();
    // اطمینان از روشن شدن دوربین بلافاصله پس از بارگذاری
    // (CameraManager از داخل خودکار initialize می‌شود)
  }

  setupEventListeners() {
    // دکمه شبیه‌سازی داخل خودرو
    const simulateBtn = document.getElementById('simulateBtn');
    simulateBtn.addEventListener('click', () => this.toggleSimulation());

    // دکمه شروع مجدد (جلسه جدید)
    const newSessionBtn = document.getElementById('newSession');
    newSessionBtn.addEventListener('click', () => this.resetSession());

    // دکمه راهنما
    const helpBtn = document.getElementById('helpBtn');
    helpBtn.addEventListener('click', () => this.showTutorial());

    // دکمه ذخیره تصویر
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.addEventListener('click', () => this.exportResult());

    // دکمه انتخاب ناحیه شیشه
    const glassSelectBtn = document.getElementById('glassSelectBtn');
    glassSelectBtn.addEventListener('click', () => glassDetector.toggleActivation());
  }

  toggleSimulation() {
    this.isSimulationMode = !this.isSimulationMode;
    document.body.classList.toggle('simulation-mode', this.isSimulationMode);
    
    const simulateBtn = document.getElementById('simulateBtn');
    simulateBtn.innerHTML = this.isSimulationMode ? 
      '<i class="ri-eye-line"></i> حالت عادی' :
      '<i class="ri-car-line"></i> شبیه‌سازی داخل خودرو';
  }

  async exportResult() {
    try {
      const imageBlob = await cameraManager.captureImage();
      const url = URL.createObjectURL(imageBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `tint-preview-${new Date().getTime()}.jpg`;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('خطا در ذخیره تصویر:', error);
      this.showError('خطا در ذخیره تصویر');
    }
  }

  resetSession() {
    glassDetector.reset();
    filters.reset();
    this.isSimulationMode = false;
    document.body.classList.remove('simulation-mode');
  }

  setupTutorial() {
    const tutorial = document.getElementById('tutorial');
    const steps = [
      {
        title: 'خوش آمدید!',
        content: 'به شبیه‌ساز پیشرفته تینت خودرو خوش آمدید. این برنامه به شما کمک می‌کند تا نمای تینت خودرو را با امکانات پیشرفته تنظیم کنید.'
      },
      {
        title: 'انتخاب ناحیه شیشه',
        content: 'برای انتخاب ناحیه شیشه، روی دکمه «انتخاب ناحیه شیشه» کلیک کنید و با کشیدن موس یا لمس، ناحیه مد نظر را مشخص کنید. سیستم هوشمند ما قسمت‌های اضافی (مثلاً ناحیه در) را اصلاح خواهد کرد.'
      },
      {
        title: 'تنظیم فیلترها',
        content: 'با استفاده از نوار لغزنده میزان تاریکی، رنگ‌های مختلف و افکت‌های ویژه (آینه‌ای، گرادیان، رنگین‌کمان) را انتخاب کنید. همچنین امکان ترکیب چند فیلتر همزمان وجود دارد.'
      },
      {
        title: 'شبیه‌سازی و ذخیره تصویر',
        content: 'با کلیک روی دکمه "شبیه‌سازی داخل خودرو" حالت شبیه‌سازی فعال می‌شود و در نهایت می‌توانید تصویر نهایی را ذخیره کنید.'
      }
    ];

    let currentStep = 0;

    const showStep = (step) => {
      tutorial.innerHTML = `
        <div class="tutorial-content">
          <h3>${steps[step].title}</h3>
          <p>${steps[step].content}</p>
          <div class="tutorial-nav">
            ${step > 0 ? '<button class="prev-btn">قبلی</button>' : ''}
            ${step < steps.length - 1 ? '<button class="next-btn">بعدی</button>' : ''}
            <button class="close-btn">پایان</button>
          </div>
        </div>
      `;
      const prevBtn = tutorial.querySelector('.prev-btn');
      const nextBtn = tutorial.querySelector('.next-btn');
      const closeBtn = tutorial.querySelector('.close-btn');
      if (prevBtn) prevBtn.addEventListener('click', () => showStep(step - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => showStep(step + 1));
      if (closeBtn) closeBtn.addEventListener('click', () => this.hideTutorial());
    };

    this.showTutorial = () => {
      tutorial.classList.remove('hidden');
      currentStep = 0;
      showStep(currentStep);
    };

    this.hideTutorial = () => {
      tutorial.classList.add('hidden');
    };
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TintSimulator();
});
