import { JobData } from "containers/careerDetail/typings";
import { JobListData } from "containers/careerNew/typings";
import { actionCreator } from "utils/actionCreator";

export const updateJobList = (jobList: JobListData) =>
  actionCreator("UPDATE_JOB_LIST", jobList);
export const updateJob = (job: JobData) => actionCreator("UPDATE_JOB", job);
