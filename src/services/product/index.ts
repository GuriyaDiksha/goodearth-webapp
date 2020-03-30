import { ProductID } from "typings/id";
import {
  Product,
  PartialProductItem,
  CollectionProductItem
} from "typings/product";
import Axios from "axios";

export default {
  fetchProductDetails: async (
    id: ProductID
  ): Promise<Product<PartialProductItem>> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/product/${id}`,
      {}
    );
    const data: Product<PartialProductItem> = { ...res.data, partial: false };

    return data;
  },
  fetchCollectionProducts: async (
    id: ProductID
  ): Promise<CollectionProductItem[]> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/collection/more-from-collection/products/${id}`,
      {}
    );

    return res.data.results as CollectionProductItem[];
  }
};
