import { CategoryProps } from "containers/categoryLanding/typings";
import { Dispatch } from "redux";
import API from "utils/api";

export default {
  fetchHomeSession1: async (dispatch: Dispatch): Promise<CategoryProps> => {
    const res: any = await API.get(
      dispatch,
      `${__API_HOST__ +
        "/myapi/promotions/multi_image_page_widget/HOMEPAGESECTION1"}`
    );
    // const data: CollectionFilter = { ...res.data };
    return { ...res };
  },
  fetchHomeSession2: async (dispatch: Dispatch): Promise<CategoryProps> => {
    const res: any = await API.get(
      dispatch,
      `${__API_HOST__ +
        "/myapi/promotions/multi_image_page_widget/HOMEPAGESECTION2"}`
    );
    return { ...res };
  },
  fetchHomeSession3: async (dispatch: Dispatch): Promise<CategoryProps> => {
    const res: any = await API.get(
      dispatch,
      `${__API_HOST__ +
        "/myapi/promotions/multi_image_page_widget/HOMEPAGESECTION3"}`
    );
    return { ...res };
  }
};
