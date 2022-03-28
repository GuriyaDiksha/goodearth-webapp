import { InitAction } from "typings/actions";
import CareerService from "services/career";
import { updateJob } from "actions/career";

const initActionCareerDetail: InitAction = async (store, path) => {
  try {
    const { jobId } = path;
    const dispatch = store.dispatch;
    const data = await CareerService.fetchJob(dispatch, parseInt(jobId));
    dispatch(updateJob(data));
  } catch (err) {
    console.log(err);
  }
};

export default initActionCareerDetail;
