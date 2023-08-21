import { fillExtensions, getContainers, getEnergyFromClosestContainer, getExtensions, harvestSource } from "./utils";
import { repairMyDamagedStructures } from "./utils/repairMyDamagedStructures";

const build = (creep: Creep, targets: ConstructionSite<BuildableStructureConstant>[]) => {
  if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
    creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
  }
};

export const roleBuilder = {
  run: (creep: Creep) => {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    if (creep.memory.building) {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      const extensions: StructureExtension[] = getExtensions(creep);
      if (targets.length > 0) {
        build(creep, targets);
      } else if (extensions.length > 0) {
        fillExtensions(creep, extensions);
      } else if (!targets.length) {
        repairMyDamagedStructures(creep);
      }

      // const targetX = 3;
      // const targetY = 27;
      // const targetRoom = "W27N34";
      // const targetPos = new RoomPosition(targetX, targetY, targetRoom);
      // const constructionSite = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, targetPos)[0];
      // if (constructionSite) {
      //   if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
      //     creep.moveTo(constructionSite, { visualizePathStyle: { stroke: "#ffffff" } });
      //   }
      // } else {
      //   creep.room.createConstructionSite(targetX, targetY, STRUCTURE_ROAD);
      // }

    } else {
      const containers = getContainers(creep);
      if (containers.length > 0) {
        // creep.say("🔄📦");
        getEnergyFromClosestContainer(creep, containers);
      } else {
        // creep.say("🔄🟨");
        harvestSource(creep);
      }
    }
  }
};
