let colorchanger = document.querySelector(".changecolor");

colorchanger.addEventListener("click", () => {
  let gridItems = document.querySelectorAll("body");
  for (let gridItem of gridItems) {
    gridItem.classList.toggle("black");
  }
});

/********************************************************************
Ez az osztály egy teljes számítógép egységet, köteget alkot. Neki csak egy már létező div id nevét kell megadni, és feltölti a szükséges HTML DOM elemekkel, amiknek a szükséges stílusát is létrehozza, CSS-ben felül lehet írni ezeket.
A screenImage egy objektum, ami a lehetséges számítógépekre rajzolandó képernyőképek src-jét tartalmazza. Ezenkívül a paraméterek között meg lehet adni a scrollozási sebességet is.
*******************************************************************/
class Preview {
  constructor(parameters) {
    this.deviceCollection = document.getElementById(parameters.containerId);
    this.deviceCollection.className = "device-collection";
    this.deviceCollection.style.position = "relative";
    this.deviceCollection.style.perspective = "800px";
    this.deviceCollection.style.transformStyle = "preserve-3d";
    this.deviceCollection.style.height = "100%";
    this.folder = parameters.folder || "media/device/";
    this.canvasFPS = 1000 / 60;
    this.slowDownOnHover = parameters.speedDownOnHover || true;
    this.stopOnClick = parameters.stopOnClick || true;
    this.speedDivider = parameters.speedDivider || 3;
    this.direction = parameters.direction || "right";

    this.devices = {
      desktop: {
        dimensions: {
          width: "100%",
        },
        imageDeviceSrc: this.folder + "computer-bk.png",
        screenCoords: {
          topX: 230,
          topY: 220,
          bottomX: 2170,
          bottomY: 1330,
        },
      },
      notebook: {
        dimensions: {
          width: "65%",
        },
        imageDeviceSrc: this.folder + "notebook-bk.png",
        screenCoords: {
          topX: 226,
          topY: 451,
          bottomX: 1776,
          bottomY: 1429,
        },
      },
      tablet: {
        dimensions: {
          width: "27%",
        },
        imageDeviceSrc: this.folder + "tablet-bk.png",
        screenCoords: {
          topX: 180,
          topY: 150,
          bottomX: 1028,
          bottomY: 1275,
        },
      },
      phone: {
        dimensions: {
          width: "22%",
        },
        imageDeviceSrc: this.folder + "phone-bk.png",
        screenCoords: {
          topX: 575,
          topY: 255,
          bottomX: 1420,
          bottomY: 1750,
        },
      },
    };

    this.deviceConfig = Object.getOwnPropertyNames(parameters.screenImage);
    let reverse =
      this.direction === "left"
        ? "+5deg"
        : this.direction === "right"
        ? "-5deg"
        : "";
    console.log(this.direction, reverse);
    this.devices.desktop.dimensions.width = "90%";
    this.devices.desktop.dimensions.bottom = "15%";
    this.devices.desktop.dimensions.left = "10%";
    this.devices.desktop.dimensions.transform =
      "rotateY(" + reverse + ") translateZ(0px)";
    /**/
    this.devices.notebook.dimensions.width = "60%";
    this.devices.notebook.dimensions.bottom = "0%";
    this.devices.notebook.dimensions.left = "0%";
    this.devices.notebook.dimensions.transform =
      "rotateY(" + reverse + ") translateZ(40px)";
    /**/
    this.devices.tablet.dimensions.bottom = "10%";
    this.devices.tablet.dimensions.right = "8%";
    this.devices.tablet.dimensions.transform =
      "rotateY(" + reverse + ") rotateX(3deg) translateZ(50px)";
    /**/
    this.devices.phone.dimensions.bottom = "9%";
    this.devices.phone.dimensions.right = "0%";
    this.devices.phone.dimensions.transform =
      "rotateY(" + reverse + ") rotateX(3deg) translateZ(70px)";
    if (!this.deviceConfig.includes("desktop")) {
      this.devices.notebook.dimensions.width = "90%";
      this.devices.notebook.dimensions.bottom = "0%";
      this.devices.notebook.dimensions.left = "0%";
      /**/
      this.devices.tablet.dimensions.bottom = "10%";
      this.devices.tablet.dimensions.right = "6%";
      /**/
      this.devices.phone.dimensions.bottom = "5%";
      this.devices.phone.dimensions.right = "0%";
    }
    if (!this.deviceConfig.includes("notebook")) {
      this.devices.tablet.dimensions.bottom = "13%";
      this.devices.tablet.dimensions.left = "8%";
      /**/
      this.devices.phone.dimensions.bottom = "12%";
      this.devices.phone.dimensions.left = "25%";
    }
    if (!this.deviceConfig.includes("tablet")) {
      this.devices.phone.dimensions.bottom = "12%";
      this.devices.phone.dimensions.left = "75%";
    }
    if (!this.deviceConfig.includes("phone")) {
      this.devices.tablet.dimensions.bottom = "11%";
      this.devices.tablet.dimensions.right = "0%";
    }
    if (
      !this.deviceConfig.includes("desktop") &&
      !this.deviceConfig.includes("notebook")
    ) {
      this.devices.tablet.dimensions.width = "70%";
      this.devices.tablet.dimensions.bottom = "5%";
      this.devices.tablet.dimensions.left = "34%";
      /**/
      this.devices.phone.dimensions.width = "70%";
      this.devices.phone.dimensions.bottom = "0%";
      this.devices.phone.dimensions.left = "0%";
    }
    if (
      !this.deviceConfig.includes("desktop") &&
      !this.deviceConfig.includes("notebook") &&
      !this.deviceConfig.includes("tablet")
    ) {
      this.devices.phone.dimensions.width = "90%";
      this.devices.phone.dimensions.bottom = "0%";
      this.devices.phone.dimensions.left = "0%";
    }
    if (
      !this.deviceConfig.includes("notebook") &&
      !this.deviceConfig.includes("tablet")
    ) {
    }
    if (
      !this.deviceConfig.includes("desktop") &&
      !this.deviceConfig.includes("tablet")
    ) {
    }

    for (let device in parameters.screenImage) {
      this.devices[device].dom = document.createElement("div");
      this.deviceCollection.appendChild(this.devices[device].dom);
      this.devices[device].dom.className = "previewContainer";
      this.devices[device].dom.id = device + "-device";
      this.devices[device].dom.style.position = "absolute";
      this.devices[device].imageDevice = new Image();
      this.devices[device].imageScreen = new Image();
      this.devices[device].imageScrollPos = 0;
      this.devices[device].imageScreenSrc = parameters.screenImage[device];
      this.devices[device].scrollSpeed = parameters.scrollSpeed;
      this.devices[device].forward = true;
      this.devices[device].stopped = parameters.stopped || false;

      this.devices[device].slowSpeed =
        parameters.scrollSpeed / this.speedDivider;
      this.devices[device].fullSpeed = parameters.scrollSpeed;

      this.devices[device].screenWidth =
        this.devices[device].screenCoords.bottomX -
        this.devices[device].screenCoords.topX;
      this.devices[device].screenHeight =
        this.devices[device].screenCoords.bottomY -
        this.devices[device].screenCoords.topY;
      this.devices[device].screenRatio =
        this.devices[device].screenWidth / this.devices[device].screenHeight;

      for (let prop in this.devices[device].dimensions) {
        this.devices[device].dom.style[prop] = this.devices[device].dimensions[
          prop
        ];
      }

      this.devices[device].canvas = document.createElement("canvas");
      this.devices[device].ctx = this.devices[device].canvas.getContext("2d");

      this.devices[device].canvas.id = device + "-preview";
      this.devices[device].canvas.style.width = "100%";
      this.devices[device].dom.appendChild(this.devices[device].canvas);

      this.init(device);

      /*this.devices[device].deviceConfig = {
        canvasId: this.devices[device].canvas.id,
        device: device,
        onScreenImage: parameters.screenImage[device],
        scrollSpeed: parameters.scrollSpeed || 5,
      };

      this.devices[device].devicePreview = new devicePreview(
        this.devices[device].deviceConfig
      );

      this.devices[device].devicePreview.init();*/
    }
    /*
    for (let device in this.devices) {
      this.devices[device].classObserver = new MutationObserver(() => {
        if (this.devices[device].dom.classList.contains("takeout")) {
          for (let otherdevice in this.devices) {
            if (device !== otherdevice) {
              this.devices[otherdevice].dom.classList.add(device + "-takedout");
            }
          }
        } /* else {
          console.log(this.devices[device].dom.classList);
          this.devices[device].dom.classList.remove(device + "-takedout");
        }*/
    /*
      });

      this.devices[device].classObserver.observe(this.devices[device].dom, {
        attributes: true,
      });
    }*/
  }

  init(device) {
    var self = this;

    this.devices[device].imageDevice.addEventListener("load", function () {
      self.devices[device].canvas.width =
        self.devices[device].imageDevice.naturalWidth;
      self.devices[device].canvas.height =
        self.devices[device].imageDevice.naturalHeight;
      self.devices[device].ctx.drawImage(
        self.devices[device].imageDevice,
        0,
        0
      );
      self.devices[device].imageScreen.src =
        self.devices[device].imageScreenSrc;
    });
    this.devices[device].imageScreen.addEventListener("load", function () {
      self.devices[device].imageWidth =
        self.devices[device].imageScreen.naturalWidth;
      self.devices[device].imageHeight =
        self.devices[device].imageScreen.naturalHeight;
      self.devices[device].imageRatio =
        self.devices[device].imageWidth / self.devices[device].imageHeight;
      self.devices[device].imageToScreen =
        self.devices[device].screenWidth / self.devices[device].imageWidth;
    });

    this.devices[device].imageDevice.src = this.devices[device].imageDeviceSrc;

    this.addBehaviour(device);
    this.animate(device);
  }

  animate(device) {
    setInterval(() => {
      if (
        this.devices[device].imageScrollPos >=
          this.devices[device].imageHeight -
            this.devices[device].screenHeight &&
        this.devices[device].forward == true
      ) {
        this.devices[device].forward = false;
        this.devices[device].reachedBottom = true;
        this.devices[device].reachedTop = false;
      } else if (this.devices[device].imageScrollPos <= 0) {
        this.devices[device].forward = true;
        this.devices[device].reachedBottom = false;
        this.devices[device].reachedTop = true;
      }
      if (!this.devices[device].stopped) {
        this.devices[device].forward
          ? (this.devices[device].imageScrollPos += this.devices[
              device
            ].scrollSpeed)
          : (this.devices[device].imageScrollPos -= this.devices[
              device
            ].scrollSpeed);
      }

      this.draw(device);
    }, this.canvasFPS);
  }

  draw(device) {
    this.devices[device].ctx.drawImage(
      this.devices[device].imageScreen,
      0,
      this.devices[device].imageScrollPos,
      this.devices[device].imageWidth,
      this.devices[device].screenHeight / this.devices[device].imageToScreen,
      this.devices[device].screenCoords.topX,
      this.devices[device].screenCoords.topY,
      this.devices[device].screenWidth,
      this.devices[device].screenHeight
    );
  }

  stopOnClickEffect(device) {
    if (this.stopOnClick) {
      this.devices[device].canvas.addEventListener("click", () => {
        this.devices[device].stopped
          ? (this.devices[device].stopped = false)
          : (this.devices[device].stopped = true);
      });
    }
  }

  slowDownOnHoverEffect(device) {
    let self = this;
    if (this.devices[device].slowDownOnHover) {
      this.devices[device].canvas.addEventListener("mouseenter", () => {
        self.devices[device].canvas.parentElement.classList.add("takeout");
        this.devices[device].scrollSpeed == 0
          ? (this.devices[device].scrollSpeed = 0)
          : (this.devices[device].scrollSpeed = this.devices[device].slowSpeed);
      });

      this.devices[device].canvas.addEventListener("mouseleave", () => {
        self.devices[device].canvas.parentElement.classList.remove("takeout");
        this.devices[device].scrollSpeed == 0
          ? (this.devices[device].scrollSpeed = 0)
          : (this.devices[device].scrollSpeed = this.devices[device].fullSpeed);
      });
    }
  }

  addBehaviour(device) {
    this.stopOnClickEffect(device);
    this.addSlowDownOnHover(device);
  }

  changeImage(imageSrc) {
    deviceImages[0].imageScreenSrc = "media/onscreen/" + imageSrc;
  }

  stop(device) {
    this.devices[device].stopped = true;
  }

  addStopOnClick(device) {
    this.devices[device].stopOnClick = true;
    this.stopOnClickEffect(device);
  }

  addSlowDownOnHover(device) {
    this.devices[device].slowDownOnHover = true;
    this.slowDownOnHoverEffect(device);
  }
}

let myPreview = new Preview({
  containerId: "myPreview",
  direction: "right",
  screenImage: {
    desktop: "media/onscreen/bvcv.jpg",
    notebook: "media/onscreen/bvcv.jpg",
    tablet: "media/onscreen/bvcv-tablet.png",
    phone: "media/onscreen/bvcv-mobile.png",
  },
  scrollSpeed: 5,
  width: "1000px",
});
