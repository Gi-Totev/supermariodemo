class TileResolver {
  constructor(matrix, tileSize = 16) {
    this.matrix = matrix;
    this.tileSize = tileSize;
  }

  toIndex(position) {
    return ~~(position / this.tileSize);
  }

  toIndexRange(position1, position2) {
    const maxPosition = Math.ceil(position2 / this.tileSize) * this.tileSize;
    const range = [];
    let _position = position1;
    do {
      range.push(this.toIndex(_position));
      _position += this.tileSize;
    } while (_position < maxPosition);

    return range;
  }

  getByIndex(indexX, indexY) {
    const tile = this.matrix.get(indexX, indexY);
    if (tile) {
      const y1 = indexY * this.tileSize;
      const y2 = y1 + this.tileSize;
      const x1 = indexX * this.tileSize;
      const x2 = x1 + this.tileSize;
      return { tile, indexX, indexY, y1, y2, x1, x2 };
    }
  }

  searchByPosition(posX, posY) {
    return this.getByIndex(this.toIndex(posX), this.toIndex(posY));
  }

  searchByRange(x1, x2, y1, y2) {
    const matches = [];
    this.toIndexRange(x1, x2).forEach((indexX) => {
      this.toIndexRange(y1, y2).forEach((indexY) => {
        const match = this.getByIndex(indexX, indexY);
        if (match) matches.push(match);
      });
    });
    return matches;
  }
}

export default TileResolver;
