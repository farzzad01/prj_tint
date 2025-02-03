class CameraManager {
    constructor() {
        this.video = document.getElementById('cameraFeed');
        this.canvas = document.getElementById('overlayCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentStream = null;
        this.isFrontCamera = false;
        
        // تنظیمات دوربین
        this.constraints = {
            video: {
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        };

        this.initializeCamera();
        this.setupEventListeners();
    }

    async initializeCamera() {
        try {
            this.currentStream = await navigator.mediaDevices.getUserMedia(this.constraints);
            this.video.srcObject = this.currentStream;
            
            this.video.onloadedmetadata = () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                this.video.play();
            };
        } catch (error) {
            console.error('خطا در دسترسی به دوربین:', error);
            this.showError('لطفاً دسترسی به دوربین را فعال کنید');
        }
    }

    async switchCamera() {
        this.isFrontCamera = !this.isFrontCamera;
        this.constraints.video.facingMode = this.isFrontCamera ? 'user' : 'environment';

        // قطع جریان فعلی
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
        }

        // راه‌اندازی مجدد دوربین با تنظیمات جدید
        await this.initializeCamera();
    }

    captureImage() {
        return new Promise((resolve) => {
            const captureCanvas = document.createElement('canvas');
            captureCanvas.width = this.video.videoWidth;
            captureCanvas.height = this.video.videoHeight;
            const ctx = captureCanvas.getContext('2d');

            // کپی تصویر از ویدیو
            ctx.drawImage(this.video, 0, 0);

            // کپی فیلترها و افکت‌ها
            ctx.drawImage(this.canvas, 0, 0);

            captureCanvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.95);
        });
    }

    setupEventListeners() {
        const switchBtn = document.getElementById('switchCamera');
        // تنها تنظیم رویداد دکمه سوئیچ دوربین باقی می‌ماند.
        switchBtn.addEventListener('click', () => this.switchCamera());
    }

    saveImage(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tint-preview-${new Date().getTime()}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
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

    destroy() {
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
        }
    }
}

export default new CameraManager();
