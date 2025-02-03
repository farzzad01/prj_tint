class TintSimulator {
    constructor() {
        this.isSimulationMode = false;
        this.cameraManager = window.cameraManager;
        this.glassDetector = window.glassDetector;
        this.filters = window.filters;

        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.setupTutorial();
    }

    setupEventListeners() {
        // دکمه شبیه‌سازی
        const simulateBtn = document.getElementById('simulateBtn');
        simulateBtn.addEventListener('click', () => this.toggleSimulation());

        // دکمه شروع مجدد
        const newSessionBtn = document.getElementById('newSession');
        newSessionBtn.addEventListener('click', () => this.resetSession());

        // دکمه راهنما
        const helpBtn = document.getElementById('helpBtn');
        helpBtn.addEventListener('click', () => this.showTutorial());

        // دکمه خروجی
        const exportBtn = document.getElementById('exportBtn');
        exportBtn.addEventListener('click', () => this.exportResult());
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
            const imageBlob = await this.cameraManager.captureImage();
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
        this.glassDetector.reset();
        this.filters.reset();
        this.isSimulationMode = false;
        document.body.classList.remove('simulation-mode');
    }

    setupTutorial() {
        const tutorial = document.getElementById('tutorial');
        const steps = [
            {
                title: 'خوش آمدید!',
                content: 'به شبیه‌ساز هوشمند تینت خودرو خوش آمدید. این برنامه به شما کمک می‌کند تا نمای تینت را روی خودروی خود مشاهده کنید.'
            },
            {
                title: 'انتخاب شیشه',
                content: 'ابتدا دوربین را روی شیشه خودرو تنظیم کرده و با کشیدن روی صفحه، ناحیه شیشه را مشخص کنید.'
            },
            {
                title: 'تنظیم تینت',
                content: 'با استفاده از نوار لغزنده، میزان تاریکی تینت را تنظیم کنید. همچنین می‌توانید رنگ و افکت‌های مختلف را امتحان کنید.'
            },
            {
                title: 'شبیه‌سازی',
                content: 'با کلیک روی دکمه "شبیه‌سازی داخل خودرو" می‌توانید نمای داخل خودرو را مشاهده کنید.'
            }
        ];

        let currentStep = 0;

        function showStep(step) {
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
        }

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

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// راه‌اندازی برنامه
document.addEventListener('DOMContentLoaded', () => {
    new TintSimulator();
});