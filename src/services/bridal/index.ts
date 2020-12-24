import { Dispatch } from "redux";
import API from "utils/api";
import {
  BridalProfileData,
  BridalItemData,
  BridalPublicProfileData
} from "containers/myAccount/components/Bridal/typings";

type SaveBridalProfileData = {
  userAddressId: number;
  occasion: string;
  eventDate: string;
  registrantName: string;
  coRegistrantName: string;
  registryName: string;
  currency: string;
};

type BridalItemsResponse = {
  count: number;
  results: BridalItemData[];
};

export default {
  saveBridalProfile: async (
    dispatch: Dispatch,
    data: SaveBridalProfileData
  ) => {
    const res = await API.post<BridalProfileData>(
      dispatch,
      `${__API_HOST__}/myapi/customer/save_bridal_profile/`,
      data
    );
    return res;
  },
  fetchBridalProfile: async (dispatch: Dispatch, id: number) => {
    const res = await API.get<BridalProfileData>(
      dispatch,
      `${__API_HOST__}/myapi/customer/get_bridal_profile/?bridalId=${id}`
    );
    return res;
  },
  updateBridalAddress: async (
    dispatch: Dispatch,
    data: { addressId: number; bridalId: number }
  ) => {
    const res = await API.post<BridalProfileData[]>(
      dispatch,
      `${__API_HOST__}/myapi/customer/update_bridal_address/`,
      data
    );
    return res;
  },
  updateBridalEventDate: async (
    dispatch: Dispatch,
    data: { bridalId: number; eventDate: string }
  ) => {
    const res = await API.post<{ message: string }>(
      dispatch,
      `${__API_HOST__}/myapi/customer/update_bridal_event_date/`,
      data
    );
    return res;
  },
  updateBridalNames: async (
    dispatch: Dispatch,
    data: {
      bridalId: number;
      registryName: string;
      registrantName: string;
      coRegistrantName: string;
    }
  ) => {
    const res = await API.post<{ message: string }>(
      dispatch,
      `${__API_HOST__}/myapi/customer/update_bridal_name/`,
      data
    );
    return res;
  },
  fetchBridalItems: async (dispatch: Dispatch, bridalId: number) => {
    const res = await API.get<BridalItemsResponse>(
      dispatch,
      `${__API_HOST__}/myapi/customer/get_bridal_items/?bridalId=${bridalId}`
    );
    return res;
  },
  deleteBridalItem: async (
    dispatch: Dispatch,
    data: { bridalId: number; productId: number }
  ) => {
    const res = await API.post<{ message: string }>(
      dispatch,
      `${__API_HOST__}/myapi/customer/delete_bridal_items/`,
      data
    );
    return res;
  },
  updateBridalItemQuantity: async (
    dispatch: Dispatch,
    data: { bridalId: number; productId: number; qtyRequested: number }
  ) => {
    const res = await API.post<{ message: string }>(
      dispatch,
      `${__API_HOST__}/myapi/customer/update_bridal_quantity/`,
      data
    );
    return res;
  },
  addToRegistry: async (
    dispatch: Dispatch,
    formData: {
      productId: number;
      bridalProfileId: number;
      qtyRequested: number;
    }
  ) => {
    const res = await API.post<{ message: string }>(
      dispatch,
      `${__API_HOST__}/myapi/customer/add_to_registry/`,
      formData
    );
    return res;
  },
  fetchBridalPublicProfile: async (dispatch: Dispatch, key: string) => {
    const res = await API.get<BridalPublicProfileData[]>(
      dispatch,
      `${__API_HOST__}/myapi/customer/get_bridal_public_profile/${key}/`
    );
    return res;
  },
  clearBridalSession: async (dispatch: Dispatch) => {
    const res = await API.get(
      dispatch,
      `${__API_HOST__}/myapi/customer/clear_bridal_session/`
    );
    return res;
  }
};
