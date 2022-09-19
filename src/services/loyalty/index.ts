import { Landing } from "reducers/loyalty/typings";
import { Dispatch } from "redux";
import API from "utils/api";
import { LoyaltyPointsResponse, Payload } from "./typings";

export default {
  getLoyaltyPoints: (dispatch: Dispatch, payload: Payload) => {
    const data = API.post<LoyaltyPointsResponse>(
      dispatch,
      `${__API_HOST__}/imast/loyalty_user_points/`,
      payload
    );
    return data;
  },
  getLoyaltyLanding: (dispatch: Dispatch) => {
    const data = API.get<Landing[]>(
      dispatch,
      `${__API_HOST__}/imast/loyalty_landing_api/`
    );
    return data;
  }
};
