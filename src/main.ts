import { roleBuilder, roleHarvester, roleLongDistanceHarvester, roleUpgrader } from "./creep/roles";
import { ErrorMapper } from "utils";
import { manageTowers } from "defense";

enum CreepRole {
  Harvester = "harvester",
  LongDistanceHarvester = "longDistanceHarvester",
  Builder = "builder",
  Upgrader = "upgrader"
}

export enum Spawns {
  Aspire = "Aspire"
}

const respawnCreeps = (creeps: Creep[], creepRole: string, count: number, bodyParts: BodyPartConstant[]) => {
  if (creeps.length < count) {
    const newName = `${creepRole}${Game.time}`;
    console.log(`Spawning new ${creepRole}: ` + newName);
    Game.spawns[Spawns.Aspire].spawnCreep(bodyParts, newName, { memory: { role: creepRole } });
  }
};

const manageCreeps = () => {
  const harvesters: Creep[] = [];
  const longDistanceHarvesters: Creep[] = [];
  const upgraders: Creep[] = [];
  const builders: Creep[] = [];

  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    switch (creep.memory.role) {
      case CreepRole.Harvester:
        harvesters.push(creep);
        roleHarvester.run(creep);
        break;
      case CreepRole.LongDistanceHarvester:
        longDistanceHarvesters.push(creep);
        roleLongDistanceHarvester.run(creep);
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
  const HARVESTER_TIER_1 = [WORK, CARRY, MOVE];
  const HARVESTER_TIER_2 = [WORK, WORK, CARRY, MOVE, MOVE];

  const roomEnergy = Game.rooms.W27N34.energyAvailable;
  const TIER_2_THRESHOLD = HARVESTER_TIER_2.length * 100;
  const tierToUse = roomEnergy >= TIER_2_THRESHOLD ? HARVESTER_TIER_2 : HARVESTER_TIER_1;

  if (!Game.spawns[Spawns.Aspire].spawning) {
    if (harvesters.length > 2) {
      respawnCreeps(upgraders, CreepRole.Upgrader, 1, HARVESTER_TIER_1);
      respawnCreeps(builders, CreepRole.Builder, 5, tierToUse);
      respawnCreeps(longDistanceHarvesters, CreepRole.LongDistanceHarvester, 10, tierToUse);
    } else {
      respawnCreeps(harvesters, CreepRole.Harvester, 3, tierToUse);
    }
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
