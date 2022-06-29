import { ProductID } from "typings/id";

export const getProductIdFromSlug = (slug: string): ProductID | null => {
  const matchArr = slug.match(/.*_(.*)$/);

  if (matchArr && matchArr.length >= 2) {
    return parseInt(matchArr[1]);
  }
  return null;
};

export const getProductNameFromSlug = (slug: string): string | null => {
  const matchArr = slug.match(/(.*)_.*$/);

  if (matchArr && matchArr.length >= 2) {
    return matchArr[1];
  }
  return null;
};

export const getParamsFromString = (value: string): any => {
  const matchArr = value.split("category-id=");
  if (matchArr && matchArr[1]) {
    return +matchArr[1].replace(/\//g, "");
  }
  return null;
};

export const getJobIdFromSlug = (slug: string): string | null => {
  const matchArr = slug.split("-");
  if (matchArr.length > 1) {
    const jobId = matchArr[matchArr.length - 1];
    if (jobId) {
      return jobId;
    }
  }
  return null;
};

export const getJobIdFromPath = (path: string): string | null => {
  const arr = path.split("/");
  if (arr.length > 2) {
    const jobId = arr[2];
    if (jobId) {
      return jobId;
    }
  }
  return null;
};
