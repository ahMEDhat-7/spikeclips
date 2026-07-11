export {
  convertSecondsToTimestamp,
  mergeHeatmapSpikes,
  capAndScoreBlocks,
  selectTopScenes,
  extractTopScenes,
} from "./merge";

export type {
  HeatmapSpike,
  MergedBlock,
  ScoredBlock,
  AlgorithmConfig,
} from "./types";

export { DEFAULT_ALGORITHM_CONFIG } from "./types";
