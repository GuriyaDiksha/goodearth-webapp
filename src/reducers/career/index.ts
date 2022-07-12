import { CareerAction, CareerData } from "./typings";

const initialState: CareerData = {
  facets: {
    depts: [],
    locs: [],
    tags: []
  },
  data: [],
  jobs: {}
};
export const career = (state = initialState, action: CareerAction) => {
  switch (action.type) {
    case "UPDATE_JOB_LIST": {
      return { ...state, ...action.payload };
    }
    case "UPDATE_JOB": {
      const newJob = {
        [action.payload.id]: action.payload
      };
      const newJobs = { ...state.jobs, newJob };
      return { ...state, jobs: newJobs };
    }
    default: {
      return state;
    }
  }
};
