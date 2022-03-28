import { JobData } from "containers/careerDetail/typings";
import { JobListData } from "containers/careerNew/typings";
import { ActionType } from "typings/actionCreator";
import * as Actions from "../../actions/career";

export type CareerAction = ActionType<typeof Actions>;
export type CareerData = JobListData & {
  jobs: {
    [x: string]: JobData;
  };
};
