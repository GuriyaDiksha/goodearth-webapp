import { Dispatch } from "redux";
// typings
// import { Basket } from "typings/basket";
// actions
import { newSearchList, updateProduct } from "actions/search";
// import { updatePlpProduct } from "actions/product";
import { PlpProps } from "containers/search/typings";
// utils
import API from "utils/api";
import { gaEventsForSearch } from "utils/validate";

export default {
  fetchSearchProducts: async function(dispatch: Dispatch, url: string) {
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/search/" + url}`
    );
    dispatch(newSearchList({ ...res }));
    // dispatch(updatePlpProduct(res.results.data));
    return res;
  },
  onLoadSearchPage: async function(dispatch: Dispatch, url: string) {
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/search/" + url}`
    );
    dispatch(newSearchList({ ...res }));
    // dispatch(updatePlpProduct(res.results.data));
    gaEventsForSearch(res);
    return res;
  },
  updateProduct: async function(
    dispatch: Dispatch,
    url: string,
    listdata: any
  ) {
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/search/" + url}`
    );
    // dispatch(updatePlpProduct(res.results.data));
    res.results.data = listdata.concat(res.results.data);
    dispatch(updateProduct({ ...res }));
    return res;
  }
};
