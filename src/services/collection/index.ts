import { CollectionFilter } from "typings/collection";
import { CollectionItem } from "components/collectionItem/typings";
import {
  CollectionSpecificProps,
  CollectionSpecificBannerProps
} from "containers/collectionSpecific/typings";
import Axios from "axios";
import API from "utils/api";
import { Dispatch } from "redux";

export default {
  fetchCollectionMapping: async (
    id: number,
    selectId?: string
  ): Promise<CollectionFilter> => {
    const res = await Axios.get(
      `${__API_HOST__ + "/myapi/collection/level_2_cat_coll_mapping/" + id}`,
      {}
    );
    res.data["selectValue"] = res.data.level2Categories.filter((item: any) => {
      return item.id == selectId;
    });
    res.data.level2Categories = res.data.level2Categories.map((data: any) => {
      return { label: data.name, value: data.name };
    });
    res.data.level2Categories.unshift({ label: "All", value: "All" });
    const data: CollectionFilter = { ...res.data };
    return data;
  },
  fetchCollectioSpecificData: async (
    dispatch: Dispatch,
    id: number,
    page?: string
  ): Promise<CollectionSpecificProps> => {
    let pagePath = "";
    if (page) {
      pagePath = page;
    } else {
      pagePath = `${__API_HOST__ +
        "/myapi/collection/collectionspecific/" +
        id +
        "/?page_size=24"}`;
    }

    const res: any = await API.get(dispatch, pagePath);
    const data: CollectionSpecificProps = res;
    return data;
  },
  fetchCollectioSpecificBanner: async (
    id: number
  ): Promise<CollectionSpecificBannerProps> => {
    const res = await Axios.get(
      `${__API_HOST__ +
        "/myapi/promotions/multi_image_page_widget/COLL_" +
        id +
        "_1/"}`,
      {}
    );
    const data: CollectionSpecificBannerProps = res.data;
    return data;
  },
  fetchCollectionData: async (id: number): Promise<CollectionItem[]> => {
    const res = await Axios.get(
      `${__API_HOST__ + "/myapi/collection/allcollection/" + id}`,
      {}
    );
    const data: CollectionItem[] = res.data.results;
    return data;
  }
};
