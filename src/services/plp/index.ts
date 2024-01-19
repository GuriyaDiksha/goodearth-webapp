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
    if (caches[url]) {
      dispatch(newPlpList({ ...caches[url] }));
      dispatch(updatePlpProduct(caches[url].results.data));
      if (typeof document != "undefined") {
        productImpression(caches[url], listPath || "PLP", currency);
      }
      return caches[url];
    }
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + `/myapi/search/` + url + `&page_size=${40}`}`
    );
    dispatch(newPlpList({ ...res }));
    dispatch(updatePlpProduct(res.results.data));
    if (typeof document != "undefined") {
      productImpression(res, listPath || "PLP", currency);
    }
    caches[url] = res;
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
