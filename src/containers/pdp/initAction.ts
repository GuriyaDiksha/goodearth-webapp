import { InitAction } from "typings/actions";
import ProductService from "services/product";
// import product from "./data.json";

import { updateProduct } from "actions/product";
import { getProductIdFromSlug } from "utils/url.ts";

const initAction: InitAction = async (dispatch, { slug }) => {
  const id = getProductIdFromSlug(slug);

  if (id) {
    const product = await ProductService.fetchProductDetails(id);
    dispatch(updateProduct(product));
  }
};

export default initAction;
