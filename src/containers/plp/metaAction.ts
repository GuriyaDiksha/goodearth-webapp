import { MetaAction } from "typings/actions";

const metaAction: MetaAction = ({ pathname, search }) => {
  return {
    page: "plp",
    pathName: pathname + search
  };
};

export default metaAction;
