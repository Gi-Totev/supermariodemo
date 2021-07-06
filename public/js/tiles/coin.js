import { Player } from "../traits/index.js";

function handle({ entity, match, resolver }) {
  if (entity.traits.has(Player)) {
    entity.traits.get(Player).addCoins(1);
    const _grid = resolver.matrix;
    _grid.delete(match.indexX, match.indexY);
  }
}

const coin = [handle, handle];

export default coin;
