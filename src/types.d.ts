export {};

declare global {
  interface RoomMemory {}

  interface Memory {
    noSeason?: boolean;
    season1?: boolean;
    season2?: boolean;
    featureToggles?: { [feature: string]: boolean };
    respawnTick?: number;
  }

  namespace NodeJS {
    interface Global {
      PLAYER_USERNAME: string;
      INVADER_USERNAME: string;
      KEEPER_USERNAME: string;
      __PROFILER_ENABLED__: boolean;
      Memory?: Memory;
      processes: () => void;
      setFeature: (feature: string, enabled: boolean) => void;
      toggleFeature: (feature: string) => boolean;
      spawnQueues: () => void;
    }
  }
}
