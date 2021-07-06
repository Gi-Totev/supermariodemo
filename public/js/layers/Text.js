function createTextLayer(font, text) {
  const size = font.size;
  return function drawDashboardRect(ctx) {
    const textWidth = text.length;
    const screenW = ~~(ctx.canvas.width / size);
    const screenH = ~~(ctx.canvas.height / size);
    const x = screenW / 2 - textWidth / 2;
    const y = screenH / 2;

    font.print(text, ctx, x * size, y * size);
  };
}

export default createTextLayer;
