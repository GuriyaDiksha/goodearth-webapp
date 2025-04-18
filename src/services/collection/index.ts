import { CollectionFilter } from "typings/collection";
import {
  CollectionItem,
  CollectionTemplatesData
} from "components/collectionItem/typings";
import {
  CollectionSpecificProps,
  CollectionSpecificBannerProps
} from "containers/collectionSpecific/typings";
import API from "utils/api";
import { Dispatch } from "redux";
import { updateCollectionSpecificTemplates } from "actions/collection";

export default {
  fetchCollectionMapping: async (
    dispatch: Dispatch,
    id: number,
    selectId?: string
  ): Promise<CollectionFilter> => {
    const res: any = await API.get(
      dispatch,
      `${__API_HOST__ + "/myapi/collection/level_2_cat_coll_mapping/" + id}`
    );

    res["selectValue"] = res.level2Categories.filter((item: any) => {
      return item.id == selectId;
    });
    res.level2Categories = res.level2Categories.map((data: any) => {
      return { label: data.name, value: data.name, id: data.id };
    });
    res.level2Categories.unshift({ label: "All", value: "All", id: id });
    const data: CollectionFilter = { ...res };
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
        "?page_size=24"}`;
    }
    const res: any = await API.get(dispatch, pagePath);
    const data: CollectionSpecificProps = res;
    return data;
  },
  fetchCollectioSpecificBanner: async (
    dispatch: Dispatch,
    id: number
  ): Promise<CollectionSpecificBannerProps> => {
    const res: any = await API.get(
      dispatch,
      `${__API_HOST__ +
        "/myapi/promotions/multi_image_page_widget/COLL_" +
        id +
        "_1"}`
    );
    const data: CollectionSpecificBannerProps = res;
    return data;
  },
  fetchCollectionData: async (
    dispatch: Dispatch,
    id: number
  ): Promise<CollectionItem[]> => {
    const res: any = await API.get(
      dispatch,
      `${__API_HOST__ + "/myapi/collection/allcollection/" + id}`
    );
    const data: CollectionItem[] = res.results;
    return data;
  },
  fetchTagData: async (
    dispatch: Dispatch,
    categoryId: number
  ): Promise<string[]> => {
    const res: any = await API.get(
      dispatch,
      `${__API_HOST__ +
        `/myapi/collection/collectiontags?category_id=${categoryId}`}`
    );
    const data: string[] = res.tags;
    return data;
  },
  // Collection specific template banner data get api call
  fetchCollectionSpecificTemplates: async function(
    dispatch: Dispatch,
    id: number
  ) {
    const res = await API.get<CollectionTemplatesData>(
      dispatch,
      `${__API_HOST__}/myapi/category/fetch_plp_templates/?collection_id=${encodeURIComponent(
        id
      )}`
    );
    dispatch(updateCollectionSpecificTemplates(res));
    return res;
  }
};
