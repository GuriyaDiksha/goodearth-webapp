import { HeaderData, SearchFeaturedData } from "components/header/typings";
import { FooterDataProps } from "components/footer/typings";
import { updatefooter } from "actions/footer";
import { updateheader } from "actions/header";
// services
import CacheService from "services/cache";
import { Dispatch } from "redux";
import API from "utils/api";
import { PlpProps } from "containers/search/typings";

export default {
  fetchHeaderDetails: async (dispatch: Dispatch): Promise<HeaderData[]> => {
    // let headerData = CacheService.get("headerData") as HeaderData[];

    // if (headerData && __API_HOST__ == "https://pb.goodearth.in") {
    //   return headerData;
    // }
    const res = await API.get<any>(
      dispatch,
      `${__API_HOST__ + "/myapi/category/top_menu_data/"}`
    );
    dispatch(updateheader(res.results));
    // headerData = res.results as HeaderData[];
    // CacheService.set("headerData", headerData);

    return res.results;
  },
  fetchFooterDetails: async (dispatch: Dispatch): Promise<FooterDataProps> => {
    let footerData: FooterDataProps | null = null;
    if (typeof document == "undefined") {
      footerData = CacheService.get("footerData") as FooterDataProps;
    }
    if (footerData && __API_HOST__ == "https://pb.goodearth.in") {
      return footerData;
    }

    const res = await API.get<any>(
      dispatch,
      `${__API_HOST__ + "/myapi/category/footer"}`
    );
    footerData = res as FooterDataProps;
    dispatch(updatefooter(footerData));
    if (typeof document == "undefined") {
      CacheService.set("footerData", footerData);
    }
    return res as FooterDataProps;
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
      `${__API_HOST__}/myapi/promotions/multi_image_page_widget/search_featured`
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
  getCustomerSlab: async function(dispatch: Dispatch, email: string) {
    const res = await API.post<{ slab: string }>(
      dispatch,
      `${__API_HOST__}/mobiquest/get_customer_slab/`,
      { email }
    );
    return res;
  },
  getCurrencyList: async function(dispatch: Dispatch) {
    const currencyList = CacheService.get("currencyList");
    if (currencyList && __API_HOST__ == "https://pb.goodearth.in") {
      return currencyList;
    }
    const res = await API.get<any>(
      dispatch,
      `${__API_HOST__}/myapi/common/country_with_symbol/`
    );
    CacheService.set("currencyList", res);
    return res;
  }
};
