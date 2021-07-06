function createCameraLayer(camera) {
  return function drawCameraRect(ctx, fromCamera) {
    ctx.strokeStyle = "purple";
    ctx.beginPath();
    ctx.rect(
      camera.position.x - fromCamera.position.x,
      camera.position.y - fromCamera.position.y,
      camera.size.x,
      camera.size.y
    );
    ctx.stroke();
  };
}

export default createCameraLayer;
