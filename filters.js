class TintFilters {
    constructor() {
        this.canvas = document.getElementById('overlayCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentFilter = {
            opacity: 0.5,
            color: '#000000',
            effect: 'none'
        };

        this.initializeFilters();
    }

    initializeFilters() {
        this.setupTintSlider();
        this.setupColorButtons();
        this.setupEffectButtons();
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

    applyFilters() {
        const selectedArea = window.glassDetector.getSelectedArea();
        if (!selectedArea) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.currentFilter.effect) {
            case 'mirror':
                this.applyMirrorEffect(selectedArea);
                break;
            case 'gradient':
                this.applyGradientEffect(selectedArea);
                break;
            case 'rainbow':
                this.applyRainbowEffect(selectedArea);
                break;
            default:
                this.applyBasicTint(selectedArea);
        }
    }

    applyBasicTint(area) {
        this.ctx.fillStyle = this.getCurrentColorWithOpacity();
        this.ctx.fillRect(area.x, area.y, area.width, area.height);
    }

    applyMirrorEffect(area) {
        const gradient = this.ctx.createLinearGradient(
            area.x, 
            area.y, 
            area.x + area.width, 
            area.y
        );

        const color = this.getCurrentColorWithOpacity();
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, this.adjustColorOpacity(color, 0.7));
        gradient.addColorStop(1, color);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(area.x, area.y, area.width, area.height);
    }

    applyGradientEffect(area) {
        const gradient = this.ctx.createLinearGradient(
            area.x,
            area.y,
            area.x,
            area.y + area.height
        );

        const color = this.getCurrentColorWithOpacity();
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(area.x, area.y, area.width, area.height);
    }

    applyRainbowEffect(area) {
        const gradient = this.ctx.createLinearGradient(
            area.x,
            area.y,
            area.x + area.width,
            area.y
        );

        const colors = [
            '#ff0000', '#ff7f00', '#ffff00',
            '#00ff00', '#0000ff', '#4b0082', '#8f00ff'
        ];

        colors.forEach((color, index) => {
            gradient.addColorStop(
                index / (colors.length - 1),
                this.adjustColorOpacity(color, this.currentFilter.opacity)
            );
        });

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(area.x, area.y, area.width, area.height);
    }

    getCurrentColorWithOpacity() {
        return this.adjustColorOpacity(
            this.currentFilter.color,
            this.currentFilter.opacity
        );
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default new TintFilters();