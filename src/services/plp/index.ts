import { Dispatch } from "redux";
// typings
// import { Basket } from "typings/basket";
// actions
import { updateProduct, newPlpList, updatePlpTemplates } from "actions/plp";
import { updatePlpProduct } from "actions/product";
import { PlpProps } from "containers/plp/typings";
// utils
import API from "utils/api";
import { productImpression } from "utils/validate";
import { Currency } from "typings/currency";
import { PlpTemplatesData } from "./typings";

const caches = {};
export default {
  fetchPlpProducts: async function(
    dispatch: Dispatch,
    url: string,
    currency?: string
  ) {
    if (caches["fetch" + currency + url]) {
      dispatch(updateProduct({ ...caches["fetch" + currency + url] }));
      dispatch(updatePlpProduct(caches["fetch" + currency + url].results.data));
      return caches["fetch" + currency + url];
    }
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + `/myapi/search/` + url}`
    );
    dispatch(updateProduct({ ...res }));
    dispatch(updatePlpProduct(res.results.data));
    caches["fetch" + currency + url] = res;
    return res;
  },
  onLoadPlpPage: async function(
    dispatch: Dispatch,
    url: string,
    currency: Currency,
    listPath: string
  ) {
    if (caches[currency + url]) {
      dispatch(newPlpList({ ...caches[currency + url] }));
      dispatch(updatePlpProduct(caches[currency + url].results.data));
      if (typeof document != "undefined") {
        productImpression(caches[currency + url], listPath || "PLP", currency);
      }
      return caches[currency + url];
    }
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + `/myapi/search/` + url}`
    );
    dispatch(newPlpList({ ...res }));
    dispatch(updatePlpProduct(res.results.data));
    if (typeof document != "undefined") {
      productImpression(res, listPath || "PLP", currency);
    }
    caches[currency + url] = res;
    return res;
  },
  updateProduct: async function(
    dispatch: Dispatch,
    url: string,
    listdata: any,
    plpMobileView?: string
  ) {
    try {
      const res = await API.get<PlpProps>(
        dispatch,
        `${__API_HOST__ + `/myapi/search/` + url}`
      );

      dispatch(updatePlpProduct(res.results.data));
      if (!plpMobileView) {
        res.results.data = listdata.concat(res.results.data);
      }
      dispatch(updateProduct({ ...res }));
      return res;
    } catch (err) {
      throw err;
    }
  },
  fetchPlpTemplates: async function(dispatch: Dispatch, categoryShop: string) {
    const res = await API.get<PlpTemplatesData>(
      dispatch,
      `${__API_HOST__}/myapi/category/fetch_plp_templates/?category_shop=${encodeURIComponent(
        categoryShop
      )}`
    );
    dispatch(updatePlpTemplates(res));
    return res;
  }
};
