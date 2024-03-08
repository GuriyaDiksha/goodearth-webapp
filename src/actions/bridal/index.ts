import { actionCreator } from "utils/actionCreator";

export const countBridal = (count: number) =>
  actionCreator("COUNT_BRIDAL", { count });
