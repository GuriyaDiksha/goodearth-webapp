import { PeopleRecommend } from "components/PeopleBuying/typings";
import { MoreCollectionItem } from "components/NewArrival/typings";
import { CategoryProps } from "containers/categoryLanding/typings";
import Axios from "axios";

export default {
  fetchCategoryMultiImage: async (
    id: number | string
  ): Promise<CategoryProps> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/promotions/multi_image_page_widget/${id}`,
      {}
    );

    // const data: CollectionFilter = { ...res.data };
    return { ...res.data };
  },
  newarrivals: async (id: number): Promise<MoreCollectionItem> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/category/newarrivals/${id}`,
      {}
    );
    return { ...res.data };
  },
  fetchLatestProduct: async (id: number): Promise<PeopleRecommend> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/category/latest_bought_products/${id}`,
      {}
    );
    return { ...res.data };
  }
};
