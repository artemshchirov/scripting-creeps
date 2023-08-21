export const getExtensions = (creep: Creep): StructureExtension[] => {
  const extensions = creep.room.find(FIND_STRUCTURES, {
    filter: structure =>
      structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  }) as StructureExtension[];

  return extensions;
};
