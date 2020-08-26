import Axios from "axios";
import { HeaderData, SearchFeaturedData } from "components/header/typings";
import { FooterDataProps } from "components/footer/typings";
// services
import CacheService from "services/cache";
import { Dispatch } from "redux";
import API from "utils/api";
import { PlpProps } from "containers/search/typings";

export default {
  fetchHeaderDetails: async (): Promise<HeaderData[]> => {
    let headerData = CacheService.get("headerData") as HeaderData[];

    if (headerData && __API_HOST__ == "https://www.goodearth.in") {
      return headerData;
    }

    const res = await Axios.get(
      `${__API_HOST__ + "/myapi/category/top_menu_data/"}`,
      {}
    );

    headerData = res.data.results as HeaderData[];

    CacheService.set("headerData", headerData);

    return headerData;
  },
  fetchFooterDetails: async (): Promise<FooterDataProps> => {
    let footerData = CacheService.get("footerData") as FooterDataProps;

    if (footerData && __API_HOST__ == "https://www.goodearth.in") {
      return footerData;
    }

    const res = await Axios.get(
      `${__API_HOST__ + "/myapi/category/footer"}`,
      {}
    );

    footerData = res.data as FooterDataProps;

    CacheService.set("footerData", footerData);

    return footerData;
  },
  makeNewsletterSignupRequest: async (dispatch: Dispatch, email: string) => {
    const res = await API.post<{ status: boolean; message: string }>(
      dispatch,
      `${__API_HOST__}/myapi/newsletter/signup/`,
      {
        email
      }
    );
    return res;
  },
  fetchSearchFeaturedContent: async (dispatch: Dispatch) => {
    const res = await API.get<SearchFeaturedData>(
      dispatch,
      `${__API_HOST__}/myapi/promotions/multi_image_page_widget/search_featured/`
    );
    return res;
  },
  fetchSearchProducts: async function(dispatch: Dispatch, url: string) {
    const res = await API.get<PlpProps>(
      dispatch,
      `${__API_HOST__ + "/myapi/search/" + url}`
    );
    // dispatch(newSearchList({ ...res }));
    // dispatch(updatePlpProduct(res.results.data));
    return res;
  },
  checkPinCodeShippable: async function(dispatch: Dispatch, pinCode: string) {
    const res = await API.post<{ message: string; status: boolean }>(
      dispatch,
      `${__API_HOST__}/myapi/address/pincode_shippable_check/`,
      { pinCode }
    );
    return res;
  },
  getCustomerSlab: async function(dispatch: Dispatch, formData: any) {
    const res = await API.post(
      dispatch,
      `${__API_HOST__}/mobiquest/get_customer_slab/`,
      formData
    );
    return res;
  }
};
