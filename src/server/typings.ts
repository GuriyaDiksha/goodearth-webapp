import stats from "../../dist/static/loadable-stats.json";

let chunk: keyof typeof stats["assetsByChunkName"];

export type Chunks = typeof chunk;

export type LinkTag = {
  chunk: Chunks;
  href: string;
  type: string;
};

export type AssetChunk = {
  [x in Chunks]?: string[];
};
