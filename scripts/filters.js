class TintFilters {
    constructor() {
      this.canvas = document.getElementById('overlayCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.opacity = 0.5;
      this.effect = 'none';
    }
    setOpacity(value) {
      this.opacity = value / 100;
      this.apply();
    }
    setEffect(effect) {
      this.effect = effect;
      this.apply();
    }
    applyArea(area) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (!area) return;
      const { x, y, width, height } = area;
      if (this.effect === 'none') {
        this.ctx.fillStyle = `rgba(0,0,0,${this.opacity})`;
      } else if (this.effect === 'mirror') {
        const grad = this.ctx.createLinearGradient(x, y, x + width, y);
        grad.addColorStop(0, `rgba(0,0,0,${this.opacity})`);
        grad.addColorStop(0.5, `rgba(0,0,0,${this.opacity * 0.7})`);
        grad.addColorStop(1, `rgba(0,0,0,${this.opacity})`);
        this.ctx.fillStyle = grad;
      } else if (this.effect === 'gradient') {
        const grad = this.ctx.createLinearGradient(x, y, x, y + height);
        grad.addColorStop(0, `rgba(0,0,0,${this.opacity})`);
        grad.addColorStop(1, `rgba(0,0,0,0)`);
        this.ctx.fillStyle = grad;
      } else if (this.effect === 'rainbow') {
        const grad = this.ctx.createLinearGradient(x, y, x + width, y);
        grad.addColorStop(0, `rgba(255,0,0,${this.opacity})`);
        grad.addColorStop(0.2, `rgba(255,165,0,${this.opacity})`);
        grad.addColorStop(0.4, `rgba(255,255,0,${this.opacity})`);
        grad.addColorStop(0.6, `rgba(0,128,0,${this.opacity})`);
        grad.addColorStop(0.8, `rgba(0,0,255,${this.opacity})`);
        grad.addColorStop(1, `rgba(75,0,130,${this.opacity})`);
        this.ctx.fillStyle = grad;
      }
      this.ctx.fillRect(x, y, width, height);
    }
    apply() {
      if (window.glassDetector && window.glassDetector.getArea()) {
        this.applyArea(window.glassDetector.getArea());
      }
    }
    reset() {
      this.opacity = 0.5;
      this.effect = 'none';
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  export default new TintFilters();
  