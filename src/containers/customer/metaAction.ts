import { MetaAction } from "typings/actions";
// import { getProductIdFromSlug } from "utils/url.ts";

const customerMetaAction: MetaAction = ({ pathname }) => {
  //   const id = getProductIdFromSlug(pathname);
  console.log(pathname);
  return {
    page: "static",
    pathName: pathname
  };
};

export default customerMetaAction;
