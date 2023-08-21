export const getEnergyFromClosestContainer = (creep: Creep, containers: StructureContainer[]) => {
  const closestContainer = creep.pos.findClosestByPath(containers);
  if (closestContainer) {
    if (creep.withdraw(closestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(closestContainer, { visualizePathStyle: { stroke: "#ffffff" } });
    }
  }
};
