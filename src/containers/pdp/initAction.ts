import axios from "axios";
import { InitAction } from "typings/actions";
// import product from "./data.json";

import { updateProduct } from "actions/product";
import { Product } from "typings/product.js";
import { getProductIdFromSlug } from "utils/url.ts";

const initAction: InitAction = async (dispatch, { slug }) => {
  const id = getProductIdFromSlug(slug);

  // const data: Product = { ...product, partial: false };
  const res = await axios.get(
    `http://api.goodearth.in/myapi/products/${id}`,
    {}
  );
  const data: Product = { ...res.data, partial: false };
  dispatch(updateProduct(data));
};

export default initAction;
