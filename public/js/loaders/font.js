import { loadImage } from "../loaders.js";
import SpriteSheet from "../SpriteSheet.js";

const CHARS =
  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{!}~";

class Font {
  constructor(sprites, size) {
    this.sprites = sprites;
    this.size = size;
  }

  print(text, ctx, x, y) {
    [...text].forEach((char, i) => {
      // const x = (i * size) % rowLength;
      // const y = ~~((i * size) / rowLength) * size;
      this.sprites.draw(char, ctx, x + i * this.size, y);
    });
  }
}

function loadFont() {
  return loadImage("/img/font.png").then((img) => {
    const fontSprite = new SpriteSheet(img);
    const size = 8;
    const rowLength = img.width;

    for (let [index, char] of [...CHARS].entries()) {
      const x = (index * size) % rowLength;
      const y = ~~((index * size) / rowLength) * size;
      fontSprite.define(char, x, y, size, size);
    }

    return new Font(fontSprite, 8);
  });
}

export default loadFont;
