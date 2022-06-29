import { updateJobList } from "actions/career";
import CareerService from "services/career";
import { InitAction } from "typings/actions";

const initActionCareer: InitAction = async store => {
  const dispatch = store.dispatch;
  try {
    const data = await CareerService.fetchJobListData(dispatch);
    dispatch(updateJobList(data));
  } catch (err) {
    console.log(err);
  }
};

export default initActionCareer;
