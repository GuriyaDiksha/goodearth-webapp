import { Dispatch } from "redux";
import API from "utils/api";
import { JobData } from "containers/careerDetail/typings";
import { ApiResponse } from "typings/api";
import { JobListData } from "containers/careerNew/typings";

export default {
  fetchJobListData: (dispatch: Dispatch) => {
    const data = API.get<JobListData>(
      dispatch,
      `${__API_HOST__}/myapi/common/job_list/`
    );
    return data;
  },
  fetchJob: (dispatch: Dispatch, jobId: number) => {
    const data = API.get<JobData>(
      dispatch,
      `${__API_HOST__}/myapi/common/job?id=${jobId}`
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
