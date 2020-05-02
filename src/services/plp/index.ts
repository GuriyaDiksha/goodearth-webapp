import { Dispatch } from "redux";
// typings
// import { Basket } from "typings/basket";
// actions
// import { PlpResponse } from "./typings";
import { PlpProps } from "containers/plp/typings";
// utils
import API from "utils/api";

export default {
  fetchPlpProducts: async function(dispatch: Dispatch, url: string) {
    const res = await API.get<PlpProps>(
      dispatch,
      `http://api.goodearth.in/myapi/search/${url}`
    );
    return res;
  },
  updateProduct: async function(dispatch: Dispatch, url: string) {
    const res = await API.get<PlpProps>(
      dispatch,
      `http://api.goodearth.in/myapi/search/${url}`
    );
    return res;
  }
};
