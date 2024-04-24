import {
  MegaMenuData,
  SaleTimerData,
  SearchFeaturedData
} from "components/header/typings";
import { FooterDataProps } from "components/footer/typings";
import { updatefooter } from "actions/footer";
import { updateheader, updateTimerData, updateStore } from "actions/header";
import HomeService from "services/home";
import { HomeProps } from "typings/home";
import { addHomeData } from "actions/home";
// services
import CacheService from "services/cache";
import { Dispatch } from "redux";
import API from "utils/api";
// import { PlpProps } from "containers/search/typings";
import { Currency } from "typings/currency";
// import * as data from "./data.json";

export default {
  fetchHeaderDetails: async (
    dispatch: Dispatch,
    currency?: Currency,
    customerGroup?: string
  ): Promise<MegaMenuData[]> => {
    //Temporary hide foe interantaional sale currency issue
    // let menu: MegaMenuData[] | null = null;
    // if (
    //   typeof document == "undefined" &&
    //   __API_HOST__ == "https://pb.goodearth.in"
    // ) {
    //   menu = CacheService.get(
    //     `menu-${currency || ""}-${customerGroup || ""}`
    //   ) as MegaMenuData[];
    // }
    // if (menu) {
    //   dispatch(updateheader(menu));
    //   return menu;
    // }

    // let headerData = CacheService.get("headerData") as HeaderData[];

    // if (headerData && __API_HOST__ == "https://pb.goodearth.in") {
    //   return headerData;
    // }
    const res = await API.get<any>(
      dispatch,
      // `${__API_HOST__ + "/myapi/category/top_menu_data/"}`
      `${__API_HOST__ + "/myapi/category/megamenu"}`
    );
    dispatch(updateheader(res.data as MegaMenuData[]));
    // headerData = res.results as HeaderData[];
    // CacheService.set("headerData", headerData);
    // if (
    //   typeof document == "undefined" &&
    //   __API_HOST__ == "https://pb.goodearth.in"
    // ) {
    //   CacheService.set(
    //     `menu-${res.currency}-${res.customerGroup}`,
    //     res.data as MegaMenuData[]
    //   );
    // }
    return res.data;
  },
  fetchFooterDetails: async (dispatch: Dispatch): Promise<FooterDataProps> => {
    let footerData: FooterDataProps | null = null;
    // if (typeof document == "undefined") {
    //   footerData = CacheService.get("footerData") as FooterDataProps;
    // }
    // if (footerData && __API_HOST__ == "https://pb.goodearth.in") {
    //   dispatch(updatefooter(footerData));
    //   return footerData;
    // }

    const res = await API.get<any>(
      dispatch,
      `${__API_HOST__ + "/myapi/category/footer"}`
    );
    footerData = res as FooterDataProps;
    dispatch(updatefooter(footerData));
    // if (typeof document == "undefined") {
    //   CacheService.set("footerData", footerData);
    // }
    return res as FooterDataProps;
  },
  makeNewsletterSignupRequest: async (
    dispatch: Dispatch,
    formData: any
  ): Promise<any> => {
    const res = await API.post<{ status: boolean; message: string }>(
      dispatch,
      `${__API_HOST__}/myapi/newsletter/signup/`,
      formData
    );
    return res;
  },

  checkSignup: async (dispatch: Dispatch, email: string) => {
    const res = await API.get<{ already_signedup: boolean }>(
      dispatch,
      `${__API_HOST__}/myapi/newsletter/check_signup/?email=${email}`
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
  fetchTrendingKeyword: async (dispatch: Dispatch) => {
    const res = await API.get<any>(
      dispatch,
      `${__API_HOST__}/myapi/search/autocomplete_init/`
    );
    return res;
  },
  fetchSearchProducts: async function(dispatch: Dispatch, url: string) {
    const res = await API.get<any>(
      dispatch,
      `${__API_HOST__ + "/myapi/search/autocomplete/" + url}`
    );
    // dispatch(newSearchList({ ...res }));
    // dispatch(updatePlpProduct(res.results.data));
    return res;
  },
  fetchYouMightLikeProducts: async (dispatch: Dispatch) => {
    const res = await API.get<any>(
      dispatch,
      `${__API_HOST__}/myapi/search/you_might_like_products/`
    );
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
      `${__API_HOST__}/imast/get_user_slab/`,
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
  },
  fetchHomepageData: async function(dispatch: Dispatch) {
    const [section1, section2, section3] = await Promise.all([
      HomeService.fetchHomeSession1(dispatch).catch(err => {
        console.log("Home session1 Api error");
      }),
      HomeService.fetchHomeSession2(dispatch).catch(err => {
        console.log("Home session2 Api error");
      }),
      HomeService.fetchHomeSession3(dispatch).catch(err => {
        console.log("Home session3 Api error");
      })
    ]);
    const data: HomeProps = {
      section1: section1,
      section2: section2,
      section3: section3
    };
    dispatch(addHomeData({ ...data }));
  },
  saveMubaarak: async function(dispatch: Dispatch, formData: any) {
    const res = await API.post<{
      message: string;
      errors: string[] | { [x: string]: string }[];
    }>(dispatch, `${__API_HOST__}/myapi/customer/save_mubarak_user/`, formData);
    return res;
  },
  getSaleTimerData: async function(dispatch: Dispatch) {
    try {
      const data: SaleTimerData[] = await API.get<SaleTimerData[]>(
        dispatch,
        `${__API_HOST__}/myapi/common/sale_countdown_timer/`
      );
      dispatch(updateTimerData(data));
    } catch (error) {
      console.log("Timer API error!");
    }
  },
  checkShopAvailability: async function(dispatch: Dispatch, sku: string) {
    const payLoad = {
      sku: sku
    };
    const res = await API.post<{
      sku: string;
    }>(
      dispatch,
      `${__API_HOST__ + "/myapi/promotions/product_availability_in_store/"}`,
      payLoad
    );
    dispatch(updateStore(res));
  },
  resendGcEmail: async function(dispatch: Dispatch, lineId: string) {
    const res = await API.get<{
      msg: string;
      status: boolean;
      email: string;
    }>(
      dispatch,
      `${__API_HOST__}/myapi/giftcard/send_giftcard_again/?line_id=${lineId}`
    );
    return res;
  }
};
