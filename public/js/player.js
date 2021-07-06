import Entity from "./Entity.js";
import { Player, PlayerController } from "./traits/index.js";

function createPlayerEnv(playerEntity) {
  const playerEnv = new Entity();
  const playerController = new PlayerController();
  playerController.setPlayer(playerEntity);
  playerController.checkPoint.set(64, 64);
  playerEnv.addTrait(playerController);
  return playerEnv;
}

function* findPlayers(entities) {
  for (const entity of entities) {
    if (entity.traits.has(Player)) {
      yield entity;
    }
  }
}

function makePlayer(entity, name) {
  const player = new Player();
  player.name = name;
  entity.addTrait(new Player());
}

export { createPlayerEnv, findPlayers, makePlayer };
