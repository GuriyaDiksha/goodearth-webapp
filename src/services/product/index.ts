import { ProductID } from "typings/id";
import {
  Product,
  PartialProductItem,
  CollectionProductItem
} from "typings/product";
import Axios from "axios";
import { Dispatch } from "redux";
import API from "utils/api";

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
      `http://api.goodearth.in/myapi/collection/more_from_collection/products/${id}`,
      {}
    );

    return res.data.results as CollectionProductItem[];
  },
  notifyMe: async function(
    dispatch: Dispatch,
    productId: ProductID,
    email: string
  ) {
    let successful, message;

    try {
      const res = await API.post<{
        successful: boolean;
        message: string;
      }>(dispatch, "http://api.goodearth.in/myapi/promotions/notify_me/", {
        productId,
        email
      });

      successful = true;
      message = res.message;
    } catch (e) {
      successful = false;
      message = e.response.data.message;
    }

    return {
      successful,
      message
    };
  }
};
