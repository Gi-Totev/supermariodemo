function createAnimation(frames, frameLength) {
  return function resolveFrame(distance) {
    const frameIndex = ~~(distance / frameLength) % frames.length;
    return frames[frameIndex];
  };
}

export { createAnimation };
