import { PeopleRecommend } from "components/PeopleBuying/typings";
import { MoreCollectionItem } from "components/NewArrival/typings";
import { CategoryProps } from "containers/categoryLanding/typings";
import { Dispatch } from "redux";
import API from "utils/api";

export default {
  fetchCategoryMultiImage: async (
    dispatch: Dispatch,
    id: number | string
  ): Promise<CategoryProps> => {
    const res: any = await API.get(
      dispatch,
      `${__API_HOST__ + "/myapi/promotions/multi_image_page_widget/" + id}`
    );

    // const data: CollectionFilter = { ...res.data };
    return { ...res };
  },
  newarrivals: async (
    dispatch: Dispatch,
    id: number
  ): Promise<MoreCollectionItem> => {
    const res: any = await API.get(
      dispatch,
      `${__API_HOST__ + "/myapi/category/newarrivals/" + id}`
    );
    return { ...res };
  },
  fetchLatestProduct: async (
    dispatch: Dispatch,
    id: number
  ): Promise<PeopleRecommend> => {
    const res: any = await API.get(
      dispatch,
      `${__API_HOST__ + "/myapi/category/latest_bought_products/" + id}`
    );
    return { ...res };
  }
};
