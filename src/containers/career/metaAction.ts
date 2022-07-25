import { MetaAction } from "typings/actions";
import { getJobIdFromSlug } from "utils/url";

const metaAction: MetaAction = ({ pathname }) => {
  const id = getJobIdFromSlug(pathname);
  return {
    page: "careers",
    jobId: id ? id.toString() : undefined
  };
};

export default metaAction;
