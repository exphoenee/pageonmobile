let colorchanger = document.querySelector(".changecolor");

colorchanger.addEventListener("click", () => {
  let gridItems = document.querySelectorAll("body");
  for (let gridItem of gridItems) {
    gridItem.classList.toggle("black");
  }
});

/*********************************************************************
ez az osztály hozza létre a previewokat, de a HTML dom elemeket nem!
édetve taratlmazza a számítógépek képeit és a képernyő alsó és felső koordinátáját.
bementenek meg kell kapja a div id nevét, ő megkeresi, a divben viszont kell legyen már egy canvas is.
Az ainmációt ő hozza létre.
Az az osztály az init emthodusának hívásával indul el.
Van egy stop és changeImage metódusa is, hogy könnyebb legyen kezelni.
********************************************************************/
class devicePreview {
  constructor(parameters) {
    this.canvas = document.getElementById(parameters.canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.canvasFPS = 1000 / 60;
    this.imageDevice = new Image();
    this.imageScreen = new Image();
    this.imageDeviceSrc = parameters.deviceImageSrc;
    this.imageScreenSrc = parameters.onScreenImage;
    this.device = parameters.device || "desktop";
    this.screenCoords = parameters.screenCoords;
    this.imageScrollPos = 0;
    this.scrollOverTime = parameters.scrollOverTime;
    this.forward = true;
    this.stopped = parameters.stopped || false;
    this.speedDivider = parameters.speedDivider || 3;
    this.folder = parameters.folder || "media/device/";
    this.slowDownOnHover = parameters.speedDownOnHover || true;
    this.stopOnClick = parameters.stopOnClick || true;
    this.config = {
      computer: {
        imageDeviceSrc: this.folder + "computer-bk.png",
        screenCoords: {
          topX: 230,
          topY: 220,
          bottomX: 2170,
          bottomY: 1330,
        },
      },
      desktop: {
        imageDeviceSrc: this.folder + "computer-bk.png",
        screenCoords: {
          topX: 230,
          topY: 220,
          bottomX: 2170,
          bottomY: 1330,
        },
      },
      notebook: {
        imageDeviceSrc: this.folder + "notebook-bk.png",
        screenCoords: {
          topX: 226,
          topY: 451,
          bottomX: 1776,
          bottomY: 1429,
        },
      },
      tablet: {
        imageDeviceSrc: this.folder + "tablet-bk.png",
        screenCoords: {
          topX: 180,
          topY: 150,
          bottomX: 1028,
          bottomY: 1275,
        },
      },
      phone: {
        imageDeviceSrc: this.folder + "phone-bk.png",
        screenCoords: {
          topX: 575,
          topY: 255,
          bottomX: 1420,
          bottomY: 1750,
        },
      },
    };
    this.screenWidth =
      this.config[this.device].screenCoords.bottomX -
      this.config[this.device].screenCoords.topX;
    this.screenHeight =
      this.config[this.device].screenCoords.bottomY -
      this.config[this.device].screenCoords.topY;
    this.screenRatio = this.screenWidth / this.screenHeight;
  }

  init() {
    var self = this;

    this.imageDevice.addEventListener("load", function () {
      self.canvas.width = self.imageDevice.naturalWidth;
      self.canvas.height = self.imageDevice.naturalHeight;
      self.ctx.drawImage(self.imageDevice, 0, 0);
      self.imageScreen.src = self.imageScreenSrc;
    });
    this.imageScreen.addEventListener("load", function () {
      self.imageWidth = self.imageScreen.naturalWidth;
      self.imageHeight = self.imageScreen.naturalHeight;
      self.imageRatio = self.imageWidth / self.imageHeight;
      self.imageToScreen = self.screenWidth / self.imageWidth;
      self.scrollSpeed =
        (self.imageHeight - self.screenHeight) /
        self.scrollOverTime /
        self.canvasFPS;
      self.slowScrollSpeed = self.scrollSpeed / self.speedDivider;
      self.fullScrollSpeed = self.scrollSpeed;
    });

    this.imageDevice.src = this.config[this.device].imageDeviceSrc;

    this.addBehaviour();
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (
        this.imageScrollPos >= this.imageHeight - this.screenHeight &&
        this.forward == true
      ) {
        this.forward = false;
        this.reachedBottom = true;
        this.reachedTop = false;
      } else if (this.imageScrollPos <= 0) {
        this.forward = true;
        this.reachedBottom = false;
        this.reachedTop = true;
      }

      if (!this.stopped) {
        this.forward
          ? (this.imageScrollPos += this.scrollSpeed)
          : (this.imageScrollPos -= this.scrollSpeed);
      }

      this.draw();
    }, this.canvasFPS);
  }

  draw() {
    this.ctx.drawImage(
      this.imageScreen,
      0,
      this.imageScrollPos,
      this.imageWidth,
      this.screenHeight / this.imageToScreen,
      this.config[this.device].screenCoords.topX,
      this.config[this.device].screenCoords.topY,
      this.screenWidth,
      this.screenHeight
    );
  }

  stopOnClickEffect() {
    if (this.stopOnClick) {
      this.canvas.addEventListener("click", () => {
        this.stopped ? (this.stopped = false) : (this.stopped = true);
      });
    }
  }

  slowDownOnHoverEffect() {
    if (this.slowDownOnHover) {
      this.canvas.addEventListener("mouseover", () => {
        this.scrollSpeed == 0
          ? (this.scrollSpeed = 0)
          : (this.scrollSpeed = this.slowScrollSpeed);
      });

      this.canvas.addEventListener("mouseleave", () => {
        this.scrollSpeed == 0
          ? (this.scrollSpeed = 0)
          : (this.scrollSpeed = this.fullScrollSpeed);
      });
    }
  }

  addBehaviour() {
    this.stopOnClickEffect();
    this.addSlowDownOnHover();
  }

  changeImage(imageSrc) {
    deviceImages[0].imageScreenSrc = "media/onscreen/" + imageSrc;
  }

  stop() {
    this.stopped = true;
  }

  addStopOnClick() {
    this.stopOnClick = true;
    this.stopOnClickEffect();
  }

  addSlowDownOnHover() {
    this.slowDownOnHover = true;
    this.slowDownOnHoverEffect();
  }
}

let devices = [
  {
    canvasId: "preview-computer",
    device: "computer",
    onScreenImage: "media/onscreen/bvcv.jpg",
    scrollOverTime: 5,
  },
  {
    canvasId: "preview-notebook",
    device: "notebook",
    onScreenImage: "media/onscreen/bvcv.jpg",
    scrollOverTime: 5,
  },
  {
    canvasId: "preview-tablet",
    device: "tablet",
    onScreenImage: "media/onscreen/bvcv-tablet.png",
    scrollOverTime: 5,
  },
  {
    canvasId: "preview-phone",
    device: "phone",
    onScreenImage: "media/onscreen/bvcv-mobile.png",
    scrollOverTime: 5,
  },
];

let deviceImages = [];
for (let device of devices) {
  let deviceImage = new devicePreview(device);
  deviceImages.push(deviceImage);
  //deviceImage.stop();
  deviceImage.init();
}

/********************************************************************
Ez az osztály egy teljes számízógépe egységet, köteget alkot. Neki csak egy már létező div id nevét kell megadni, és feltölti a szükséges HTML DOM elemekkel, amiknek a szükséges sztílusát is létrehozza, css-ben felül lehet írni ezeket.
A screenImage egy objektum, ami a lehetséges számítógépekre rajzolandó képernyőképek src-jét tartalmazz, ezenkívűl a paraméterek között meg lehet adni a scrollozási sebességet is.
*******************************************************************/
class Preview {
  constructor(parameters) {
    this.container = document.getElementById(parameters.containerId);
    this.deviceCollection = document.createElement("div");
    this.container.appendChild(this.deviceCollection);
    this.deviceCollection.className = "device-collection";
    this.deviceCollection.style.height = this.deviceCollection.offsetWidth;
    this.devices = {
      desktop: { dimensions: { width: "100%" } },
      notebook: { dimensions: { width: "65%", bottom: "50%", right: "-50%" } },
      tablet: { dimensions: { width: "27%", bottom: "93%", left: "10%" } },
      phone: { dimensions: { width: "22%", width: "22%", bottom: "113%" } },
    };

    for (let device in this.devices) {
      this.devices[device].dom = document.createElement("div");
      this.deviceCollection.appendChild(this.devices[device].dom);
      this.devices[device].dom.className = "previewContainer";
      this.devices[device].dom.id = device + "-device";
      this.devices[device].dom.style.position = "relative";
      for (let prop in this.devices[device].dimensions) {
        this.devices[device].dom.style[prop] = this.devices[device].dimensions[
          prop
        ];
      }

      this.devices[device].canvas = document.createElement("canvas");
      this.devices[device].canvas.id = device + "-preview";
      this.devices[device].canvas.style.width = "100%";
      this.devices[device].dom.appendChild(this.devices[device].canvas);

      this.devices[device].deviceConfig = {
        canvasId: this.devices[device].canvas.id,
        device: device,
        onScreenImage: parameters.screenImage[device],
        scrollOverTime: parameters.scrollOverTime || 5,
      };

      this.devices[device].devicePreview = new devicePreview(
        this.devices[device].deviceConfig
      );
      this.devices[device].devicePreview.init();
    }
  }
}

let myPreview = new Preview({
  containerId: "myPreview",
  screenImage: {
    desktop: "media/onscreen/bvcv.jpg",
    notebook: "media/onscreen/bvcv.jpg",
    tablet: "media/onscreen/bvcv-tablet.png",
    phone: "media/onscreen/bvcv-mobile.png",
  },
  scrollOverTime: 10,
});
