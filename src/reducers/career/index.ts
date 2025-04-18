import { CareerAction, CareerData } from "./typings";

const initialState: CareerData = {
  facets: {
    depts: [],
    locs: [],
    tags: []
  },
  data: [],
  job: {},
  depts: []
};
export const career = (state = initialState, action: CareerAction) => {
  switch (action.type) {
    case "UPDATE_JOB_LIST": {
      return { ...state, ...action.payload };
    }
    case "UPDATE_JOB": {
      return { ...state, job: action.payload };
    }
    case "UPDATE_DEPT_LIST": {
      return { ...state, depts: action.payload };
    }
    default: {
      return state;
    }
  }
};
