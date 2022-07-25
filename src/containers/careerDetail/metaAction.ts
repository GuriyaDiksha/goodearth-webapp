import { MetaAction } from "typings/actions";
import { getJobIdFromPath } from "utils/url";

const metaAction: MetaAction = ({ pathname }) => {
  const jobId = getJobIdFromPath(pathname);
  return {
    page: "careers",
    jobId: jobId ? jobId.toString() : undefined
  };
};

export default metaAction;
