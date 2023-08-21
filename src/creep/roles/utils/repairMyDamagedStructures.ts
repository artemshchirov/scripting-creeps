export const repairMyDamagedStructures = (creep: Creep) => {
  const damagedStructures = creep.room.find(FIND_MY_STRUCTURES, {
    filter: structure => structure.hits < structure.hitsMax
  });
  damagedStructures.sort((a, b) => a.hits - b.hits);
  if (damagedStructures.length > 0) creep.repair(damagedStructures[0]);
};
