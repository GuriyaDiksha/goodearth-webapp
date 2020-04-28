import { CollectionFilter } from "typings/collection";
import { CollectionItem } from "components/collectionItem/typings";
import {
  CollectionSpecificProps,
  CollectionSpecificBannerProps
} from "containers/collectionSpecific/typings";
import Axios from "axios";

export default {
  fetchCollectionMapping: async (id: number): Promise<CollectionFilter> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/collection/level_2_cat_coll_mapping/${id}`,
      {}
    );
    res.data.level2Categories = res.data.level2Categories.map((data: any) => {
      return { label: data.name, value: data.name };
    });
    res.data.level2Categories.unshift({ label: "All", value: "All" });
    const data: CollectionFilter = { ...res.data };
    return data;
  },
  fetchCollectioSpecificData: async (
    id: number
  ): Promise<CollectionSpecificProps> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/collection/collectionspecific/${id}`,
      {}
    );
    const data: CollectionSpecificProps = res.data;
    return data;
  },
  fetchCollectioSpecificBanner: async (
    id: number
  ): Promise<CollectionSpecificBannerProps> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/promotions/multi_image_page_widget/COLL_${id}_1/`,
      {}
    );
    const data: CollectionSpecificBannerProps = res.data;
    return data;
  },
  fetchCollectionData: async (id: number): Promise<CollectionItem[]> => {
    const res = await Axios.get(
      `http://api.goodearth.in/myapi/collection/allcollection/${id}`,
      {}
    );
    const data: CollectionItem[] = res.data.results;
    return data;
  }
};
