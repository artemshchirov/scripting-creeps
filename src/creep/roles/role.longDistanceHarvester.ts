import { getContainers, harvestSource } from "./utils";

const transferEnergy = (creep: Creep, targets: AnyStructure[]) => {
  if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
  }
};

const getTargets = (creep: Creep) => {
  const destinations: AnyStructure[] = creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      (structure.structureType === STRUCTURE_EXTENSION ||
        structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_TOWER) &&
      structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  });
  const containers: AnyStructure[] = getContainers(creep, true);
  return destinations.concat(containers);
};

export const roleLongDistanceHarvester = {
  run: (creep: Creep) => {
    if (creep.store.getFreeCapacity() > 0) {
      const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: resource => resource.resourceType === RESOURCE_ENERGY
      });
      if (droppedEnergy) {
        if (creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
          creep.moveTo(droppedEnergy);
        }
      } else {
        harvestSource(creep, 1);
        // creep.say("🔄 harvest");
      }
    } else {
      const targets = getTargets(creep);
      if (targets.length > 0) {
        transferEnergy(creep, targets);
      } else if (creep.room.controller) {
        creep.moveTo(creep.room.controller);
      }
    }
  }
};
