let colorchanger = document.querySelector(".changecolor");

colorchanger.addEventListener("click", () => {
  let gridItems = document.querySelectorAll(".grid-item");
  console.log(gridItems);
  for (let gridItem of gridItems) {
    gridItem.classList.toggle("black");
  }
});

class pagePreview {
  constructor(parameters) {
    this.canvas = document.getElementById(parameters.canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.imageDevice = new Image();
    this.imageScreen = new Image();
    this.imageDeviceSrc = parameters.deviceImageSrc;
    this.imageScreenSrc = parameters.onScreenImage;
    this.device = parameters.device;
    this.screenCoords = parameters.screenCoords;
  }

  init() {
    switch (this.device) {
      case "computer":
        this.imageDeviceSrc = "media/computer-bk.png";
        this.cutCoords = {};
        this.screenCoords = {
          topX: 230,
          topY: 220,
          bottomX: 2170,
          bottomY: 1330,
        };
        break;
      case "notebook":
        this.imageDeviceSrc = "media/notebook-bk.png";
        this.cutCoords = {};
        this.screenCoords = {
          topX: 226,
          topY: 451,
          bottomX: 1776,
          bottomY: 1429,
        };
        break;
      case "tablet":
        this.imageDeviceSrc = "media/tablet-bk.png";
        this.cutCoords = {};
        this.screenCoords = {
          topX: 180,
          topY: 150,
          bottomX: 1028,
          bottomY: 1275,
        };
        break;
      case "phone":
        this.imageDeviceSrc = "media/phone-bk.png";
        this.cutCoords = {};
        this.screenCoords = {
          topX: 575,
          topY: 255,
          bottomX: 1420,
          bottomY: 1750,
        };
        break;
      default:
        this.imageDeviceSrc = "media/computer-bk.png";
        break;
    }

    this.screenWidth = this.screenCoords.bottomX - this.screenCoords.topX;
    this.screenHeight = this.screenCoords.bottomY - this.screenCoords.topY;
    this.screenRatio = this.screenWidth / this.screenHeight;

    let self = this;
    this.imageDevice.addEventListener("load", function () {
      self.canvas.width = self.imageDevice.naturalWidth;
      self.canvas.height = self.imageDevice.naturalHeight;
      self.canvasScreenRatio = self.canvas.width / self.canvas.height;
      self.ctx.drawImage(self.imageDevice, 0, 0);
      self.imageScreen.src = self.imageScreenSrc;
    });
    this.imageScreen.addEventListener("load", function () {
      self.imageWidth = self.imageScreen.naturalWidth;
      self.imageHeight = self.imageScreen.naturalHeight;
      self.imageRatio = self.imageWidth / self.imageHeight;

      self.ctx.drawImage(
        self.imageScreen,
        0,
        0,
        self.imageWidth,
        self.screenHeight,
        self.screenCoords.topX,
        self.screenCoords.topY,
        self.screenWidth,
        self.screenHeight
      );
    });
    this.imageDevice.src = this.imageDeviceSrc;
  }

  draw() {}
}

let devices = [
  {
    canvasId: "preview-computer",
    device: "notebook",
    onScreenImage: "media/onscreen/bvcv.png",
  },
  {
    canvasId: "preview-notebook",
    device: "computer",
    onScreenImage: "media/onscreen/bvcv.png",
  },
  {
    canvasId: "preview-tablet",
    device: "tablet",
    onScreenImage: "media/onscreen/bvcv-tablet.png",
  },
  {
    canvasId: "preview-phone",
    device: "phone",
    onScreenImage: "media/onscreen/bvcv-mobile.png",
  },
];

let deviceImages = [];
for (let device of devices) {
  let deviceImage = new pagePreview(device);
  deviceImages.push(deviceImage);
  deviceImage.init();
}
