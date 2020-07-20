import { Dispatch } from "redux";
import API from "utils/api";
import { JobData } from "containers/career/typings";
import { ApiResponse } from "typings/api";

export default {
  fetchJobData: (dispatch: Dispatch) => {
    const data = API.get<JobData>(
      dispatch,
      `${__API_HOST__}/myapi/common/career_landing_page/`
    );
    return data;
  },
  saveJobApplication: (dispatch: Dispatch, formData: any) => {
    const data = API.post<ApiResponse>(
      dispatch,
      `${__API_HOST__}/myapi/common/save_job_application/`,
      formData
    );
    return data;
  }
};
