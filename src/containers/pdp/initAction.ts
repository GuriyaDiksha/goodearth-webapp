import { InitAction } from "typings/actions";
import product from "./data.json";

import { updateProduct } from "actions/product";
import { Product } from "typings/product.js";

const initAction: InitAction = async dispatch => {
  const data: Product = { ...product, partial: false };

  dispatch(updateProduct(data));
};

export default initAction;
