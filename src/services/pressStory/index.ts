import { Dispatch } from "redux";
import API from "utils/api";
import { PressStoriesResponse } from "containers/pressStories/typings";

export default {
  fetchPressStories: async (dispatch: Dispatch, year: string) => {
    const data = API.get<PressStoriesResponse>(
      dispatch,
      `${__API_HOST__}/myapi/promotions/press_story/${year}`
    );
    return data;
  },
  submitPressStoryEnquiry: async (dispatch: Dispatch, data: any) => {
    const res = API.post<{ message: string | { [x: string]: string[] } }>(
      dispatch,
      `${__API_HOST__}/myapi/promotions/press_story_enquiry/`,
      data
    );
    return res;
  }
};
