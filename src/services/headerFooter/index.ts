import Axios from "axios";
import { HeaderData } from "components/header/typings";
import { FooterDataProps } from "components/footer/typings";
// services
import CacheService from "services/cache";

export default {
  fetchHeaderDetails: async (): Promise<HeaderData[]> => {
    let headerData = CacheService.get("headerData") as HeaderData[];

    if (headerData) {
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

    if (footerData) {
      return footerData;
    }

    const res = await Axios.get(
      `${__API_HOST__ + "/myapi/category/footer"}`,
      {}
    );

    footerData = res.data as FooterDataProps;

    CacheService.set("footerData", footerData);

    return footerData;
  }
};
