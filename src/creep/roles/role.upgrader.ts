import { getContainers, getEnergyFromClosestContainer, harvestSource } from "./utils";

const upgradeController = (creep: Creep, controller: StructureController) => {
  if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
    creep.moveTo(controller, { visualizePathStyle: { stroke: "#ffffff" } });
  }
};

export const roleUpgrader = {
  run: (creep: Creep) => {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
      creep.memory.upgrading = true;
      creep.say("⚡ upgrade");
    }

    if (creep.room.controller && creep.memory.upgrading) {
      upgradeController(creep, creep.room.controller);
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
