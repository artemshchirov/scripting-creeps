import { Spawns } from "../main";

export const manageTowers = () => {
  const towers = Game.spawns[Spawns.Aspire].room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_TOWER
  });

  for (const tower of towers) {
    if (tower.structureType === STRUCTURE_TOWER) {
      const damagedStructures = tower.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType === STRUCTURE_ROAD || structure.structureType === STRUCTURE_CONTAINER) &&
            structure.hits < structure.hitsMax
          );
        }
      });
      damagedStructures.sort((a, b) => a.hits - b.hits);
      const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower.attack(closestHostile);
      } else if (damagedStructures.length > 0) {
        tower.repair(damagedStructures[0]);
      }
    }
  }
};
