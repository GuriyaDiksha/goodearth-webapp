import { MetaAction } from "typings/actions";
import { getProductIdFromSlug } from "utils/url.ts";

const metaAction: MetaAction = ({ pathname }) => {
  const id = getProductIdFromSlug(pathname);

  return {
    page: "pdp",
    productId: id ? id.toString() : undefined
  };
};

export default metaAction;
