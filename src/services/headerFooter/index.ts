import { HeaderData } from "components/header/typings";
import { FooterDataProps } from "components/footer/typings";
import Axios from "axios";

export default {
  fetchHeaderDetails: async (): Promise<HeaderData[]> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/category/top_menu_data/`,
      {}
    );
    return res.data.results as HeaderData[];
  },
  fetchFooterDetails: async (): Promise<FooterDataProps> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/category/footer`,
      {}
    );
    return res.data as FooterDataProps;
  }
};
