import { MetaAction } from "typings/actions";
import { getProductIdFromSlug } from "utils/url.ts";

const metaAction: MetaAction = ({ pathname }) => {
  const id = getProductIdFromSlug(pathname);

  return {
    page: "collection",
    pathName: id ? id.toString() : undefined
  };
};

export default metaAction;
