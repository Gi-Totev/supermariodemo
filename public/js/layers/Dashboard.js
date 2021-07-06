import { findPlayers } from "../player.js";
import { Player, LevelTimer } from "../traits/index.js";

function getPlayerTrait(level) {
  for (const entity of findPlayers(level.entities)) {
    return entity.traits.get(Player);
  }
}

function getTimerTrait(level) {
  for (const entity of level.entities) {
    if (entity.traits.has(LevelTimer)) {
      return entity.traits.get(LevelTimer);
    }
  }
}

function createDashboardLayer(font, level) {
  const LINE1 = font.size;
  const LINE2 = LINE1 * 2;

  function displayString(number, length) {
    let _str = `${~~number}`;
    while (_str.length < length) {
      _str = `0${_str}`;
    }
    return _str;
  }

  return function drawDashboardRect(ctx) {
    const { currentTime } = getTimerTrait(level);

    const playerTrait = getPlayerTrait(level);

    if (!playerTrait) return;

    font.print(playerTrait.playerName, ctx, 16, LINE1);
    font.print("@x" + displayString(playerTrait.coins, 2), ctx, 86, LINE2);
    font.print("WORLD", ctx, 152, LINE1);
    font.print("TIME", ctx, 208, LINE1);
    font.print(displayString(playerTrait.score, 5), ctx, 16, LINE2);
    font.print(level.name, ctx, 160, LINE2);
    font.print(displayString(currentTime, 4), ctx, 208, LINE2);
  };
}

export default createDashboardLayer;
