import { Currency } from "./currency";

export type PriceRecord = {
  [x in Currency]: number;
};
