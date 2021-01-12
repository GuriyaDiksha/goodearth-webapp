import { Dispatch } from "redux";
// typings
// import { Basket } from "typings/basket";
// actions
import { updateProduct, newPlpList } from "actions/plp";
import { updatePlpProduct } from "actions/product";
import { PlpProps } from "containers/plp/typings";
// utils
import API from "utils/api";
import * as valid from "utils/validate";
import { Currency } from "typings/currency";

export default {
  fetchPlpProducts: async function(dispatch: Dispatch, url: string) {
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + `/myapi/search/` + url}`
    );
    dispatch(updateProduct({ ...res }));
    dispatch(updatePlpProduct(res.results.data));
    return res;
  },
  onLoadPlpPage: async function(
    dispatch: Dispatch,
    url: string,
    currency: Currency
  ) {
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + `/myapi/search/` + url}`
    );
    dispatch(newPlpList({ ...res }));
    dispatch(updatePlpProduct(res.results.data));
    if (typeof document != "undefined") {
      valid.productImpression(res, "PLP", currency);
    }
    return res;
  },
  updateProduct: async function(
    dispatch: Dispatch,
    url: string,
    listdata: any
  ) {
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + `/myapi/search/` + url}`
    );
    dispatch(updatePlpProduct(res.results.data));
    res.results.data = listdata.concat(res.results.data);
    dispatch(updateProduct({ ...res }));
    return res;
  }
};
