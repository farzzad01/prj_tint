class TintFilters {
    constructor() {
      this.canvas = document.getElementById('overlayCanvas');
      this.ctx = this.canvas.getContext('2d');
      // تنظیمات پیش‌فرض فیلتر
      this.currentFilter = {
        opacity: 0.5,
        color: '#000000',
        effect: 'none'
      };
      this.combineFilters = false;
  
      this.initializeFilters();
    }
  
    initializeFilters() {
      this.setupTintSlider();
      this.setupColorButtons();
      this.setupEffectButtons();
      this.setupCombineOption();
    }
  
    setupTintSlider() {
      const slider = document.getElementById('tintSlider');
      const output = document.getElementById('tintValue');
      slider.addEventListener('input', (e) => {
        this.currentFilter.opacity = e.target.value / 100;
        output.textContent = `${e.target.value}%`;
        this.applyFilters();
      });
    }
  
    setupColorButtons() {
      const colorBtns = document.querySelectorAll('.color-btn');
      colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          colorBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFilter.color = btn.dataset.color;
          this.applyFilters();
        });
      });
    }
  
    setupEffectButtons() {
      const effectBtns = document.querySelectorAll('.effect-btn');
      effectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          effectBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFilter.effect = btn.dataset.effect;
          this.applyFilters();
        });
      });
    }
  
    setupCombineOption() {
      const combineCheckbox = document.getElementById('combineFilters');
      combineCheckbox.addEventListener('change', (e) => {
        this.combineFilters = e.target.checked;
        this.applyFilters();
      });
    }
  
    applyFilters() {
      const glassArea = window.glassDetector.getSelectedArea();
      // اگر ناحیه انتخاب نشده باشد، کل تصویر به عنوان ناحیه هدف در نظر گرفته می‌شود.
      let area = glassArea || { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height };
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      // اگر حالت ترکیب چند فیلتر فعال باشد، ابتدا افکت اصلی اعمال شده و سپس فیلتر پایه اضافه می‌شود.
      if (this.combineFilters && this.currentFilter.effect !== 'none') {
        this.applyEffect(area);
        this.applyBasicTint(area);
      } else if (this.currentFilter.effect !== 'none') {
        this.applyEffect(area);
      } else {
        this.applyBasicTint(area);
      }
    }
  
    applyBasicTint(area) {
      this.ctx.fillStyle = this.getCurrentColorWithOpacity();
      this.ctx.fillRect(area.x, area.y, area.width, area.height);
    }
  
    applyEffect(area) {
      switch (this.currentFilter.effect) {
        case 'mirror':
          this.applyMirrorEffect(area);
          break;
        case 'gradient':
          this.applyGradientEffect(area);
          break;
        case 'rainbow':
          this.applyRainbowEffect(area);
          break;
        default:
          break;
      }
    }
  
    applyMirrorEffect(area) {
      const gradient = this.ctx.createLinearGradient(area.x, area.y, area.x + area.width, area.y);
      const color = this.getCurrentColorWithOpacity();
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, this.adjustColorOpacity(color, 0.7));
      gradient.addColorStop(1, color);
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(area.x, area.y, area.width, area.height);
    }
  
    applyGradientEffect(area) {
      const gradient = this.ctx.createLinearGradient(area.x, area.y, area.x, area.y + area.height);
      const color = this.getCurrentColorWithOpacity();
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(area.x, area.y, area.width, area.height);
    }
  
    applyRainbowEffect(area) {
      const gradient = this.ctx.createLinearGradient(area.x, area.y, area.x + area.width, area.y);
      const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8f00ff'];
      colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), this.adjustColorOpacity(color, this.currentFilter.opacity));
      });
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(area.x, area.y, area.width, area.height);
    }
  
    getCurrentColorWithOpacity() {
      return this.adjustColorOpacity(this.currentFilter.color, this.currentFilter.opacity);
    }
  
    adjustColorOpacity(color, opacity) {
      if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      return color;
    }
  
    reset() {
      this.currentFilter = {
        opacity: 0.5,
        color: '#000000',
        effect: 'none'
      };
      document.getElementById('tintSlider').value = 50;
      document.getElementById('tintValue').textContent = '50%';
      document.querySelectorAll('.color-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index === 0);
      });
      document.querySelectorAll('.effect-btn').forEach(btn => btn.classList.remove('active'));
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  
  export default new TintFilters();
  