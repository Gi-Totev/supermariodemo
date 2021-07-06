import { findPlayers } from "../player.js";
import { Player } from "../traits/index.js";

function getPlayer(level) {
  for (const entity of findPlayers(level.entities)) {
    return entity;
  }
}

function createPlayerProgress(font, level) {
  const size = font.size;
  const LINE1 = font.size;
  const LINE2 = LINE1 * 2;
  const spriteBuffer = document.createElement("canvas");
  spriteBuffer.width = 32;
  spriteBuffer.height = 32;
  const spriteBufferCtx = spriteBuffer.getContext("2d");

  function displayString(number, length) {
    let _str = `${~~number}`;
    while (_str.length < length) {
      _str = `0${_str}`;
    }
    return _str;
  }

  return function drawPlayerProgress(ctx) {
    const entity = getPlayer(level);
    const player = entity.traits.get(Player);

    font.print(`WORLD ${level.name}`, ctx, size * 12, size * 12);

    spriteBufferCtx.clearRect(0, 0, 32, 32);
    entity.draw(spriteBufferCtx);
    ctx.drawImage(spriteBuffer, size * 12, size * 15);

    font.print(
      "x   " + displayString(player.lives, 0),
      ctx,
      size * 16,
      size * 16
    );
  };
}

export default createPlayerProgress;
