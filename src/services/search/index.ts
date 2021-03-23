import { Dispatch } from "redux";
// typings
// import { Basket } from "typings/basket";
// actions
import { newSearchList, updateProduct } from "actions/search";
// import { updatePlpProduct } from "actions/product";
import { PlpProps } from "containers/search/typings";
// utils
import API from "utils/api";

export default {
  fetchSearchProducts: async function(dispatch: Dispatch, url: string) {
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/search/algolia_search" + url}`
    );
    dispatch(newSearchList({ ...res }));
    // dispatch(updatePlpProduct(res.results.data));
    return res;
  },
  onLoadSearchPage: async function(dispatch: Dispatch, url: string) {
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/search/algolia_search" + url}`
    );
    dispatch(newSearchList({ ...res }));
    // dispatch(updatePlpProduct(res.results.data));
    return res;
  },
  updateProduct: async function(
    dispatch: Dispatch,
    url: string,
    listdata: any
  ) {
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/search/algolia_search" + url}`
    );
    // dispatch(updatePlpProduct(res.results.data));
    res.results.data = listdata.concat(res.results.data);
    dispatch(updateProduct({ ...res }));
    return res;
  }
};
