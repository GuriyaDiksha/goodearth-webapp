import { JobData } from "containers/careerDetail/typings";
import { JobListData, DeptListData } from "containers/careerNew/typings";
import { actionCreator } from "utils/actionCreator";

export const updateJobList = (jobList: JobListData) =>
  actionCreator("UPDATE_JOB_LIST", jobList);
export const updateJob = (job: JobData) => actionCreator("UPDATE_JOB", job);
export const updateDeptList = (deptList: DeptListData) =>
  actionCreator("UPDATE_DEPT_LIST", deptList);
