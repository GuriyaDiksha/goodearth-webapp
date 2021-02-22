import { InitAction } from "typings/actions";
import ProductService from "services/product";
// import product from "./data.json";

import { updateProduct } from "actions/product";
import { getProductIdFromSlug } from "utils/url.ts";
import { Product, PartialProductItem } from "typings/product.js";

const initAction: InitAction = async (store, path, cur, currency, history) => {
  const { slug } = path;
  const dispatch = store.dispatch;
  const id = getProductIdFromSlug(slug);
  if (id) {
    const product = await ProductService.fetchProductDetails(
      dispatch,
      id
    ).catch(err => {
      if (err?.response?.status == 500) {
        // history.push('/error-page')
        if (typeof document == "object") {
          history?.push("/error-page");
        }
        throw err;
      }
      console.log("PDP API FAIL", err);
    });
    if (product) {
      dispatch(
        updateProduct({ ...product, partial: false } as Product<
          PartialProductItem
        >)
      );
    }
  }
};

export default initAction;
