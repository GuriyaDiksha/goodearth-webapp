import { ProductID } from "typings/id";
import { Product, PartialProductItem } from "typings/product";
import Axios from "axios";

export default {
  fetchProductDetails: async (
    id: ProductID
  ): Promise<Product<PartialProductItem>> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/products/${id}`,
      {}
    );
    const data: Product<PartialProductItem> = { ...res.data, partial: false };

    return data;
  },
  fetchCollectionProducts: async (
    id: ProductID
  ): Promise<PartialProductItem[]> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/products/${id}/more-from-collection`,
      {}
    );

    return res.data.results as PartialProductItem[];
  }
};
