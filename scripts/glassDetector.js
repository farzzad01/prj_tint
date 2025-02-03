class GlassDetector {
  constructor() {
    this.canvas = document.getElementById('overlayCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.area = null;
    this.active = false;
    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.initEvents();
  }
  initEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.active) return;
      this.isDrawing = true;
      const rect = this.canvas.getBoundingClientRect();
      this.startX = e.clientX - rect.left;
      this.startY = e.clientY - rect.top;
    });
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.active || !this.isDrawing) return;
      const rect = this.canvas.getBoundingClientRect();
      this.currentX = e.clientX - rect.left;
      this.currentY = e.clientY - rect.top;
      this.drawSelection();
    });
    this.canvas.addEventListener('mouseup', () => {
      if (!this.active) return;
      this.isDrawing = false;
      this.setArea();
      this.clearSelection();
      window.filters.apply();
    });
  }
  drawSelection() {
    this.clearSelection();
    const x = Math.min(this.startX, this.currentX);
    const y = Math.min(this.startY, this.currentY);
    const width = Math.abs(this.currentX - this.startX);
    const height = Math.abs(this.currentY - this.startY);
    this.ctx.strokeStyle = '#ff0000';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(x, y, width, height);
  }
  clearSelection() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.area) {
      window.filters.applyArea(this.area);
    }
  }
  setArea() {
    const x = Math.min(this.startX, this.currentX);
    const y = Math.min(this.startY, this.currentY);
    const width = Math.abs(this.currentX - this.startX);
    const height = Math.abs(this.currentY - this.startY);
    this.area = { x, y, width, height };
  }
  getArea() {
    return this.area;
  }
  toggleActivation() {
    this.active = !this.active;
    if (this.active) {
      alert('حالت انتخاب فعال شد. ناحیه شیشه را انتخاب کنید.');
    }
  }
  reset() {
    this.area = null;
    this.active = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
export default new GlassDetector();
