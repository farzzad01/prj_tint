class GlassDetector {
    constructor() {
      this.canvas = document.getElementById('overlayCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.isDrawing = false;
      this.startX = 0;
      this.startY = 0;
      this.currentX = 0;
      this.currentY = 0;
      this.selectedArea = null;
      this.active = false; // حالت انتخاب فعال یا غیر فعال
  
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      // فقط زمانی که حالت انتخاب فعال باشد رویدادها پردازش می‌شود.
      this.canvas.addEventListener('mousedown', (e) => {
        if (!this.active) return;
        this.startDrawing(e);
      });
      this.canvas.addEventListener('mousemove', (e) => {
        if (!this.active) return;
        this.draw(e);
      });
      this.canvas.addEventListener('mouseup', (e) => {
        if (!this.active) return;
        this.finishDrawing(e);
      });
  
      // رویدادهای لمسی
      this.canvas.addEventListener('touchstart', (e) => {
        if (!this.active) return;
        e.preventDefault();
        const touch = e.touches[0];
        this.startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
      });
      this.canvas.addEventListener('touchmove', (e) => {
        if (!this.active) return;
        e.preventDefault();
        const touch = e.touches[0];
        this.draw({ clientX: touch.clientX, clientY: touch.clientY });
      });
      this.canvas.addEventListener('touchend', (e) => {
        if (!this.active) return;
        this.finishDrawing(e);
      });
    }
  
    startDrawing(e) {
      const rect = this.canvas.getBoundingClientRect();
      this.isDrawing = true;
      this.startX = e.clientX - rect.left;
      this.startY = e.clientY - rect.top;
    }
  
    draw(e) {
      if (!this.isDrawing) return;
      const rect = this.canvas.getBoundingClientRect();
      this.currentX = e.clientX - rect.left;
      this.currentY = e.clientY - rect.top;
      // پاک کردن لایه‌های قبلی
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // رسم مستطیل انتخاب
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#FF0000';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([6, 4]);
      this.ctx.strokeRect(
        this.startX,
        this.startY,
        this.currentX - this.startX,
        this.currentY - this.startY
      );
      // نمایش ابعاد انتخاب
      this.ctx.font = '14px Arial';
      this.ctx.fillStyle = '#ffffff';
      const width = Math.abs(this.currentX - this.startX);
      const height = Math.abs(this.currentY - this.startY);
      this.ctx.fillText(`${width}px × ${height}px`, (this.startX + this.currentX) / 2, (this.startY + this.currentY) / 2);
    }
  
    finishDrawing(e) {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      this.ctx.setLineDash([]);
      // ذخیره ناحیه انتخاب اولیه
      let x = Math.min(this.startX, this.currentX);
      let y = Math.min(this.startY, this.currentY);
      let width = Math.abs(this.currentX - this.startX);
      let height = Math.abs(this.currentY - this.startY);
      this.selectedArea = { x, y, width, height };
  
      // فراخوانی الگوریتم اصلاح انتخاب (به صورت اولیه)
      this.optimizeSelection();
    }
  
    // یک الگوریتم ساده برای اصلاح انتخاب؛ در عمل می‌توان از کتابخانه‌های پردازش تصویر استفاده کرد.
    optimizeSelection() {
      if (!this.selectedArea) return;
      // در اینجا به صورت نمونه ما فقط ناحیه انتخاب شده را کمی کاهش می‌دهیم (به عنوان مثال حذف حاشیه‌های اضافی)
      const padding = 10; // به عنوان حاشیه‌ای جهت حذف قسمت‌های ناخواسته
      let { x, y, width, height } = this.selectedArea;
      x += padding;
      y += padding;
      width = Math.max(width - padding * 2, 0);
      height = Math.max(height - padding * 2, 0);
      this.selectedArea = { x, y, width, height };
      this.redrawOptimizedSelection();
      // پس از پایان انتخاب، حالت انتخاب غیرفعال می‌شود.
      this.active = false;
    }
  
    redrawOptimizedSelection() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#00FF00';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        this.selectedArea.x,
        this.selectedArea.y,
        this.selectedArea.width,
        this.selectedArea.height
      );
    }
  
    getSelectedArea() {
      return this.selectedArea;
    }
  
    reset() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.selectedArea = null;
      this.isDrawing = false;
      this.active = false;
    }
  
    toggleActivation() {
      // فعال یا غیرفعال کردن حالت انتخاب
      this.active = !this.active;
      if (this.active) {
        this.showInstruction();
      } else {
        // در صورت لغو، پاکسازی می‌کنیم
        this.reset();
      }
    }
  
    showInstruction() {
      // نمایش یک پیغام موقتی جهت راهنمایی کاربر
      const instruction = document.createElement('div');
      instruction.className = 'instruction';
      instruction.textContent = 'لطفاً ناحیه شیشه را انتخاب کنید';
      document.body.appendChild(instruction);
      setTimeout(() => instruction.remove(), 3000);
    }
  }
  
  export default new GlassDetector();
  