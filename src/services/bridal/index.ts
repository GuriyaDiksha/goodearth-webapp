import { Dispatch } from "redux";
import API from "utils/api";
import { BridalProfileData } from "containers/myAccount/components/Bridal/typings";

type SaveBridalProfileData = {
  userAddressId: number;
  occasion: string;
  eventDate: string;
  registrantName: string;
  coRegistrantName: string;
  registryName: string;
  currency: string;
};

export default {
  saveBridalProfile: async (
    dispatch: Dispatch,
    data: SaveBridalProfileData
  ) => {
    const res = await API.post<any>( // check response type
      dispatch,
      `${__API_HOST__}/myapi/customer/save_bridal_profile/`,
      data
    );
    return res;
  },
  fetchBridalProfile: async (dispatch: Dispatch, id: number) => {
    const res = await API.get<BridalProfileData>(
      dispatch,
      `${__API_HOST__}/myapi/customer/get_bridal_profile/?bridal_id=${id}`
    );
    return res;
  },
  updateBridalAddress: async (
    dispatch: Dispatch,
    data: { addressId: number; bridalId: number }
  ) => {
    const res = await API.post<BridalProfileData>(
      dispatch,
      `${__API_HOST__}/myapi/customer/update_bridal_address/`,
      data
    );
    return res;
  }
  // fetchGridalProfile: async (dispatch: Dispatch, ) => {
  //     const res = await API.get<>(
  //         dispatch,
  //         `${__API_HOST__}/myapi/,`
  //     )
  //     return res;
  // },
  // fetchGridalProfile: async (dispatch: Dispatch, ) => {
  //     const res = await API.get<>(
  //         dispatch,
  //         `${__API_HOST__}/myapi/,`
  //     )
  //     return res;
  // }
};
