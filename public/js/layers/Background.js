import TileResolver from "../TileResolver.js";

function createBackgroundLayer(level, tiles, sprites) {
  const resolver = new TileResolver(tiles);
  const buffer = document.createElement("canvas");
  buffer.width = 256 + 16;
  buffer.height = 240;

  const ctx = buffer.getContext("2d");

  function redraw(startIndex, endIndex) {
    ctx.clearRect(0, 0, buffer.width, buffer.height);
    for (let x = startIndex; x <= endIndex; x++) {
      const col = tiles.grid[x];
      if (col) {
        col.forEach((tile, y) => {
          if (sprites.animations.has(tile.name)) {
            sprites.drawAnimation(
              tile.name,
              ctx,
              x - startIndex,
              y,
              level.totalTime
            );
          } else {
            sprites.drawTile(tile.name, ctx, x - startIndex, y);
          }
        });
      }
    }
  }

  return function drawBackgroundLayer(ctx, camera) {
    const drawWidth = resolver.toIndex(camera.size.x);
    const drawFrom = resolver.toIndex(camera.position.x);
    const drawTo = drawFrom + drawWidth;

    redraw(drawFrom, drawTo);

    ctx.drawImage(buffer, ~~(-camera.position.x % 16), ~~-camera.position.y);
  };
}

export default createBackgroundLayer;
