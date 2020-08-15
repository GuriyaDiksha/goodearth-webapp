import { InitAction } from "typings/actions";
import ProductService from "services/product";
// import product from "./data.json";

import { updateProduct } from "actions/product";
import { getProductIdFromSlug } from "utils/url.ts";
import { Product, PartialProductItem } from "typings/product.js";

const initAction: InitAction = async (dispatch, { slug }) => {
  const id = getProductIdFromSlug(slug);

  if (id) {
    const product = await ProductService.fetchProductDetails(id).catch(err => {
      console.log("PDP API FAIL", err);
    });
    dispatch(
      updateProduct({ ...product, partial: false } as Product<
        PartialProductItem
      >)
    );
  }
};

export default initAction;
