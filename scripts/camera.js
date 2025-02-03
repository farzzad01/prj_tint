class CameraManager {
    constructor() {
      this.video = document.getElementById('cameraFeed');
      this.stream = null;
      this.isFront = false;
      this.constraints = {
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      this.init();
      this.setupEvents();
    }
    async init() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
        this.video.srcObject = this.stream;
        this.video.onloadedmetadata = () => {
          this.video.play();
          document.getElementById('overlayCanvas').width = this.video.videoWidth;
          document.getElementById('overlayCanvas').height = this.video.videoHeight;
        };
      } catch(e) {
        alert('دسترسی به دوربین امکان‌پذیر نیست');
      }
    }
    async switchCamera() {
      this.isFront = !this.isFront;
      this.constraints.video.facingMode = this.isFront ? { exact: "user" } : { exact: "environment" };
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      await this.init();
    }
    setupEvents() {
      document.getElementById('switchCamera').addEventListener('click', () => {
        this.switchCamera();
      });
    }
  }
  export default new CameraManager();
  