function createSpriteLayer(entities, width = 64, height = 64) {
  const spriteBuffer = document.createElement("canvas");
  spriteBuffer.width = width;
  spriteBuffer.height = height;
  const spriteBufferCtx = spriteBuffer.getContext("2d");

  return function drawSpriteLayer(ctx, camera) {
    entities.forEach((entity) => {
      spriteBufferCtx.clearRect(0, 0, width, height);
      entity.draw(spriteBufferCtx);
      ctx.drawImage(
        spriteBuffer,
        ~~(entity.position.x - camera.position.x),
        ~~(entity.position.y - camera.position.y)
      );
    });
  };
}

export default createSpriteLayer;
