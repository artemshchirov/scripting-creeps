import { getPercentage } from "../../../utils";

export const getContainers = (creep: Creep, notFull = false) => {
  const containers = creep.room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_CONTAINER
  }) as StructureContainer[];

  if (notFull) return containers.filter(container => container.store.getFreeCapacity() > 0);

  const notEmpty = containers.filter(
    container => getPercentage(container.store[RESOURCE_ENERGY], container.store.getCapacity()) >= 10
  );
  return notEmpty;
};
