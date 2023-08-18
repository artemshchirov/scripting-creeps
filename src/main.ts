import { roleBuilder, roleHarvester, roleUpgrader } from "./creep/roles";
import { ErrorMapper } from "utils/ErrorMapper";

enum CreepRole {
  Harvester = "harvester",
  Builder = "builder",
  Upgrader = "upgrader"
}

enum Spawns {
  Aspire = "Aspire"
}

const HARVESTER_TIER_1 = [WORK, CARRY, MOVE];
const HARVESTER_TIER_2 = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE];

const respawnCreeps = (
  creeps: Creep[],
  creepRole: string,
  count: number,
  bodyParts: BodyPartConstant[] = HARVESTER_TIER_2
) => {
  if (creeps.length < count) {
    const newName = `${creepRole}${Game.time}`;
    console.log(`Spawning new ${creepRole}: ` + newName);
    Game.spawns[Spawns.Aspire].spawnCreep(bodyParts, newName, { memory: { role: creepRole } });
  }
};

const manageCreeps = () => {
  const harvesters: Creep[] = [];
  const upgraders: Creep[] = [];
  const builders: Creep[] = [];

  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    switch (creep.memory.role) {
      case CreepRole.Harvester:
        harvesters.push(creep);
        roleHarvester.run(creep);
        break;
      case CreepRole.Upgrader:
        upgraders.push(creep);
        roleUpgrader.run(creep);
        break;
      case CreepRole.Builder:
        builders.push(creep);
        roleBuilder.run(creep);
        break;
      default:
        break;
    }
  }

  if (!Game.spawns[Spawns.Aspire].spawning) {
    respawnCreeps(harvesters, CreepRole.Harvester, 2);
    respawnCreeps(upgraders, CreepRole.Upgrader, 2);
    respawnCreeps(builders, CreepRole.Builder, 2);
  }

  console.log("Harvesters: ", harvesters.length);
  console.log("Upgraders: ", upgraders.length);
  console.log("Builders: ", builders.length);
};

const cleanMemory = () => {
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};

const logGameInfo = () => {
  console.log(`Current game tick is ${Game.time}`);
  for (const name in Game.rooms) console.log(`Room ${name} has ${Game.rooms[name].energyAvailable} energy`);
};

const manageTowers = () => {
  const towers = Game.spawns[Spawns.Aspire].room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_TOWER
  });

  for (const tower of towers) {
    if (tower.structureType === STRUCTURE_TOWER) {
      const damagedStructures = tower.room.find(FIND_STRUCTURES, {
        filter: structure => structure.hits < structure.hitsMax
      });
      damagedStructures.sort((a, b) => a.hits - b.hits);
      const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) tower.attack(closestHostile);
      else if (damagedStructures.length > 0) tower.repair(damagedStructures[0]);
    }
  }
};

const drawSpawnStatus = () => {
  if (Game.spawns[Spawns.Aspire].spawning) {
    const spawningCreep = Game.creeps[Game.spawns[Spawns.Aspire].spawning.name];
    Game.spawns[Spawns.Aspire].room.visual.text(
      `🛠️${spawningCreep.memory.role || "creep"}`,
      Game.spawns[Spawns.Aspire].pos.x + 1,
      Game.spawns[Spawns.Aspire].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }
};

export const loop = ErrorMapper.wrapLoop(() => {
  logGameInfo();
  manageCreeps();
  drawSpawnStatus();
  manageTowers();
  cleanMemory();
});
