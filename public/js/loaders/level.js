import { Matrix } from "../Math.js";
import Entity from "../Entity.js";
import Level from "../Level.js";
import { createBackgroundLayer, createSpriteLayer } from "../layers/index.js";
import { loadSpriteSheet } from "./sprite.js";
import { loadJSON } from "../loaders.js";
import { loadMusicSheet } from "./music.js";
import { LevelTimer } from "../traits/LevelTimer.js";
import Trigger from "../traits/Trigger.js";

function loadPattern(name) {
  return loadJSON(`/sprites/patterns/${name}.json`);
}

function createTimer(entity) {
  const timer = new Entity();
  timer.addTrait(new LevelTimer());
  return timer;
}

function setupBehaviour(level) {
  const timer = createTimer();
  level.entities.add(timer);
  level.events.listen(LevelTimer.EVENT_TIMER_OK, () => {
    level.music.playTheme();
  });
  level.events.listen(LevelTimer.EVENT_TIMER_HURRY, () => {
    level.music.playHurryTheme();
  });
}

function setupBackgrounds(levelSpec, level, backgroundSprites, patterns) {
  levelSpec.layers.forEach((layer) => {
    const grid = createGrid(layer.tiles, patterns);

    const backgroundLayer = createBackgroundLayer(
      level,
      grid,
      backgroundSprites
    );
    level.compositor.layers.push(backgroundLayer);
    level.tileCollider.addGrid(grid);
  });
}

function setupEntities(levelSpec, level, entityFactory) {
  const spriteLayer = createSpriteLayer(level.entities);
  level.compositor.layers.push(spriteLayer);
  levelSpec.entities.forEach((entitySpec) => {
    const {
      name,
      position: [x, y],
    } = entitySpec;
    const createEntity = entityFactory[name];
    const entity = createEntity();
    entity.position.set(x, y);
    level.entities.add(entity);
  });
}

function setupTriggers(levelSpec, level) {
  if (!levelSpec.triggers) return;
  for (const triggerSpec of levelSpec.triggers) {
    const trigger = new Trigger();

    trigger.conditions.push((_trigger, entities, _gameCtx, level) => {
      level.events.emit(level.EVENT_TRIGGER, triggerSpec, entity, entities);
    });

    const entity = new Entity();
    entity.addTrait(trigger);
    entity.position.set(triggerSpec.position[0], triggerSpec.position[1]);
    entity.size.set(64, 64);
    level.entities.add(entity);
  }
}

function createLevelLoader(entityFactory) {
  return function loadLevel(name) {
    return loadJSON(`/levels/${name}.json`)
      .then((levelSpec) =>
        Promise.all([
          levelSpec,
          loadSpriteSheet(levelSpec.spriteSheet),
          loadMusicSheet(levelSpec.musicSheet),
          loadPattern(levelSpec.patternSheet),
        ])
      )
      .then(([levelSpec, backgroundSprites, musicPlayer, patterns]) => {
        const level = new Level();
        level.name = name;
        level.music.setPlayer(musicPlayer);

        setupBackgrounds(levelSpec, level, backgroundSprites, patterns);
        setupEntities(levelSpec, level, entityFactory);
        setupTriggers(levelSpec, level);
        setupBehaviour(level);

        return level;
      });
  };
}

function createGrid(tiles, patterns) {
  const grid = new Matrix();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, tile);
  }

  return grid;
}

function* expandSpan(xStart, xLen, yStart, yLen) {
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;
  for (let x = xStart; x < xEnd; ++x) {
    for (let y = yStart; y < yEnd; ++y) {
      yield { x, y };
    }
  }
}

function expandRange(range) {
  if (range.length === 4) {
    const [xStart, xLen, yStart, yLen] = range;
    return expandSpan(xStart, xLen, yStart, yLen);
  } else if (range.length === 3) {
    const [xStart, xLen, yStart] = range;
    return expandSpan(xStart, xLen, yStart, 1);
  } else if (range.length === 2) {
    const [xStart, yStart] = range;
    return expandSpan(xStart, 1, yStart, 1);
  }
}

function* expandRanges(ranges) {
  for (const range of ranges) {
    yield* expandRange(range);
  }
}

function* expandTiles(tiles, patterns) {
  function* walkTiles(tiles, offsetX, offsetY) {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.pattern) {
          const tiles = patterns[tile.pattern].tiles;
          yield* walkTiles(tiles, derivedX, derivedY);
        } else {
          yield {
            tile,
            x: derivedX,
            y: derivedY,
          };
        }
      }
    }
  }

  yield* walkTiles(tiles, 0, 0);
}

export { createLevelLoader };