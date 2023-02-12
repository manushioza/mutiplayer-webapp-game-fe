new class Game {
    constructor() {
      this.c = document.querySelector('canvas')
      this.cx = this.c.getContext('2d')
      this.init()
      this.c.addEventListener('mousedown', this.onmousedown.bind(this), false);
      this.c.addEventListener('mouseup', this.onmouseup.bind(this), false);
      this.c.addEventListener('mousemove', this.onmousemove.bind(this), false);
    }
    init() {
      this.c.height = 190;
      this.c.width = 140;
      this.cx.fillStyle = 'rgb(200, 200, 250)';
      this.drawletter('*');
      this.cx.fillStyle = 'rgb(0, 0, 50)';
      this.letterpixels = this.getpixelamount(200, 200, 250);
    }
    pixelthreshold() {
      if (this.getpixelamount(0, 0, 50) / this.letterpixels > 0.75) {
        console.log('you got it!');
      }
    }
    showerror(error) {
      this.mousedown = false;
      console.log(error)
    }
    getpixelcolour(x, y) {
      const pixels = this.cx.getImageData(0, 0, this.c.width, this.c.height);
      const index = ((y * (pixels.width * 4)) + (x * 4));
      return {
        r: pixels.data[index],
        g: pixels.data[index + 1],
        b: pixels.data[index + 2],
        a: pixels.data[index + 3]
      };
    }
    paint(x, y) {
      const colour = this.getpixelcolour(x, y);
      if (colour.a === 0) {
        this.showerror('you are outside');
      } else {
          const fillRange = 20;
          const stack = [[x, y]];
          while (stack.length > 0) {
              const pixel = stack.pop();
              if (pixel[0] < 0 || pixel[0] >= this.c.width) continue;
              if (pixel[1] < 0 || pixel[1] >= this.c.height) continue;
              if(((x - pixel[0]) ** 2 + (y - pixel[1]) ** 2) ** .5 > fillRange) continue;
              const color = this.getpixelcolour(...pixel);
              if (color.a === 0) continue;
              if (color.r === 0 && color.g === 0 && color.b === 50) continue;
  
              this.cx.fillRect(pixel[0], pixel[1], 1, 1);
  
              if(pixel[0] >= x) stack.push([pixel[0] + 1, pixel[1]]);
              if(pixel[0] <= x) stack.push([pixel[0] - 1, pixel[1]]);
              if(pixel[1] >= y) stack.push([pixel[0], pixel[1] + 1]);
              if(pixel[1] <= y) stack.push([pixel[0], pixel[1] - 1]);
          }
      }
    }
    onmousedown(ev) {
      this.mousedown = true;
      ev.preventDefault();
    }
    onmouseup(ev) {
      this.mousedown = false;
      this.pixelthreshold();
      ev.preventDefault();
    }
    onmousemove(e) {
      const x = Math.round(e.clientX - this.c.getBoundingClientRect().left);
      const y = Math.round(e.clientY - this.c.getBoundingClientRect().top);
      if (this.mousedown) {
        this.paint(x, y);
      } else {
          // console.log(this.getpixelcolour(x, y));
      }
    }
    getpixelamount(r, g, b) {
      const pixels = this.cx.getImageData(0, 0, this.c.width, this.c.height);
      const all = pixels.data.length;
      let amount = 0;
      for (let i = 0; i < all; i += 4) {
        if (pixels.data[i] === r && pixels.data[i + 1] === g && pixels.data[i + 2] === b) {
          amount++;
        }
      }
      return amount;
    }
    drawletter(letter) {
      const path = new Path2D('M60.4248047,180.541992 C73.445638,180.541992 84.9405924,177.693685 94.909668,171.99707 C104.878743,166.300456 112.508138,158.610026 117.797852,148.925781 C123.087565,139.241536 125.732422,128.499349 125.732422,116.699219 C125.732422,108.561198 124.267578,100.952148 121.337891,93.8720703 C118.408203,86.7919922 114.379883,80.6681315 109.25293,75.5004883 C104.125977,70.3328451 98.1648763,66.2841797 91.3696289,63.3544922 C84.5743815,60.4248047 77.2705078,58.9599609 69.4580078,58.9599609 C59.6923828,58.9599609 49.0315755,62.0524089 37.4755859,68.2373047 L37.4755859,68.2373047 L44.4335938,28.6865234 L102.416992,28.6865234 C108.439128,28.6865234 112.996419,27.3844401 116.088867,24.7802734 C119.181315,22.1761068 120.727539,18.758138 120.727539,14.5263672 C120.727539,4.8421224 114.379883,0 101.68457,0 L101.68457,0 L37.2314453,0 C30.2327474,0 25.1871745,1.58691406 22.0947266,4.76074219 C19.0022786,7.93457031 16.8863932,13.0208333 15.7470703,20.0195312 L15.7470703,20.0195312 L5.49316406,78.4912109 C4.59798177,83.6181641 4.15039062,86.3850911 4.15039062,86.7919922 C4.15039062,90.4541016 5.69661458,93.7296549 8.7890625,96.6186523 C11.8815104,99.5076497 15.4215495,100.952148 19.4091797,100.952148 C23.0712891,100.952148 27.730306,98.815918 33.3862305,94.543457 C39.0421549,90.2709961 43.375651,87.2802734 46.3867188,85.5712891 C49.3977865,83.8623047 54.4026693,83.0078125 61.4013672,83.0078125 C67.0979818,83.0078125 72.265625,84.370931 76.9042969,87.097168 C81.5429688,89.8234049 85.2457682,93.9534505 88.0126953,99.4873047 C90.7796224,105.021159 92.1630859,111.694336 92.1630859,119.506836 C92.1630859,126.749674 90.8813477,133.219401 88.3178711,138.916016 C85.7543945,144.61263 82.1126302,149.088542 77.3925781,152.34375 C72.672526,155.598958 67.179362,157.226562 60.9130859,157.226562 C54.0771484,157.226562 47.8922526,155.212402 42.3583984,151.184082 C36.8245443,147.155762 32.430013,141.520182 29.1748047,134.277344 C25.8382161,126.383464 20.7519531,122.436523 13.9160156,122.436523 C9.92838542,122.436523 6.61214193,123.860677 3.96728516,126.708984 C1.32242839,129.557292 0,132.568359 0,135.742188 C0,140.950521 1.89208984,147.033691 5.67626953,153.991699 C9.46044922,160.949707 15.8894857,167.114258 24.9633789,172.485352 C34.0372721,177.856445 45.8577474,180.541992 60.4248047,180.541992 Z');
      this.cx.fill(path);
    }
  }

  module.exports = { Game}