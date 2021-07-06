function createEntityLayer(entities) {
  return function drawBoundingBox(ctx, camera) {
    ctx.strokeStyle = "red";
    entities.forEach((entity) => {
      ctx.beginPath();
      ctx.rect(
        entity.bounds.left - camera.position.x,
        entity.bounds.top - camera.position.y,
        entity.size.x,
        entity.size.y
      );
      ctx.stroke();
    });
  };
}

function createTileCandidateLayer(tileResolver) {
  const resolvedTiles = [];
  const tileSize = tileResolver.tileSize;

  const _getByIndex = tileResolver.getByIndex;
  tileResolver.getByIndex = function (x, y) {
    resolvedTiles.push({ x, y });
    return _getByIndex.call(tileResolver, x, y);
  };

  return function drawTileCandidates(ctx, camera) {
    ctx.fillStyle = "blue";
    resolvedTiles.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.rect(
        x * tileSize - camera.position.x,
        y * tileSize - camera.position.y,
        tileSize,
        tileSize
      );
      ctx.stroke();
    });
    resolvedTiles.length = 0;
  };
}

function createCollisionLayer(level) {
  const drawBoundingBoxex = createEntityLayer(level.entities);
  const drawTileCandidates = level.tileCollider.resolvers.map(
    createTileCandidateLayer
  );

  return function drawCollision(ctx, camera) {
    drawTileCandidates.forEach((draw) => draw(ctx, camera));
    drawBoundingBoxex(ctx, camera);
  };
}

export default createCollisionLayer;
