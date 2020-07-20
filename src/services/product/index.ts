import { ProductID } from "typings/id";
import {
  Product,
  PartialProductItem,
  CollectionProductItem
} from "typings/product";
import Axios from "axios";
import { Dispatch } from "redux";
import API from "utils/api";
import { Fields } from "components/CorporateEnquiryPopup/typings";

export default {
  fetchProductDetails: async (
    id: ProductID
  ): Promise<Product<PartialProductItem>> => {
    const res = await Axios.get(`${__API_HOST__ + `/myapi/product/` + id}`, {});
    const data: Product<PartialProductItem> = { ...res.data, partial: false };
    return data;
  },
  fetchCollectionProducts: async (
    id: ProductID
  ): Promise<CollectionProductItem[]> => {
    const res = await Axios.get(
      `${__API_HOST__ +
        `/myapi/collection/more_from_collection/products/` +
        id}`,
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
      }>(dispatch, `${__API_HOST__ + `/myapi/promotions/notify_me/`}`, {
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
  },
  enquire: async function(
    dispatch: Dispatch,
    params: {
      productId: ProductID;
      email: string;
      name: string;
      contactNo: string;
      quantity: string;
      query: string;
    }
  ) {
    let successful,
      errors: { [x in Fields]?: string[] } = {};

    try {
      await API.post<{
        message: string;
        data: {
          [x in Fields]: string[];
        };
      }>(dispatch, `${__API_HOST__ + `/myapi/promotions/corporate_enquiry/`}`, {
        productId: params.productId,
        name: params.name,
        email: params.email,
        query: params.query,
        contactNo: params.contactNo,
        qty: params.quantity
      });

      successful = true;
    } catch (e) {
      successful = false;
      errors = e.response.data;
    }

    return {
      successful,
      errors
    };
  }
};
