import { Dispatch } from "redux";
import API from "utils/api";
import { JobData } from "containers/career/typings";

export default {
  fetchJobData: (dispatch: Dispatch) => {
    const data = API.get<JobData>(
      dispatch,
      "https://api.goodearth.in/myapi/common/career_landing_page/"
    );
    return data;
  }
};
