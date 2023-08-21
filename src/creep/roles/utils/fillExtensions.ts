export const fillExtensions = (creep: Creep, extensions: StructureExtension[]) => {
  if (creep.transfer(extensions[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(extensions[0], { visualizePathStyle: { stroke: "#ffffff" } });
  }
};
