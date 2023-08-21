export const harvestSource = (creep: Creep, longDistance = 0) => {
  const sources = creep.room.find(FIND_SOURCES);
  if (creep.harvest(sources[longDistance]) === ERR_NOT_IN_RANGE && sources[0].energy > 0) {
    creep.moveTo(sources[longDistance], { visualizePathStyle: { stroke: "#ffaa00" } });
  }
};
