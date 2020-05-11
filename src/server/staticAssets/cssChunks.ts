import fs from "fs";
import path from "path";
import stats from "../../../dist/static/loadable-stats.json";
import { Chunks, AssetChunk } from "../typings";

const staticPath = path.resolve("dist/static");

let chunk: Chunks;

const cssChunks: AssetChunk = {};

for (chunk in stats["assetsByChunkName"]) {
  let assets = stats["assetsByChunkName"][chunk];

  if (!Array.isArray(assets)) {
    assets = [assets];
  }
  assets.every(asset => {
    if (/css$/.test(asset)) {
      const chunkContent = fs.readFileSync(`${staticPath}/${asset}`, "utf-8");
      if (!cssChunks[chunk]) {
        cssChunks[chunk] = [];
      }
      cssChunks[chunk]?.push(chunkContent);
    }
    return true;
  });
}

export { cssChunks };
