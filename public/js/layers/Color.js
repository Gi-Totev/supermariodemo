function createColorLayer(color) {
  return function drawColorRect(ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };
}

export default createColorLayer;
