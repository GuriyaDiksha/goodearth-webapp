import { ProductID } from "typings/id";

export const getProductIdFromSlug = (slug: string): ProductID | null => {
  const matchArr = slug.match(/.*_(.*)$/);

  if (matchArr && matchArr.length >= 2) {
    return parseInt(matchArr[1]);
  }
  return null;
};
