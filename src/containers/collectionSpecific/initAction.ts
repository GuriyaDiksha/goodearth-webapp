import { InitAction } from "typings/actions";
import CollectionService from "services/collection";
import { PartialProductItem } from "typings/product";
import {
  updateCollectionSpecificData,
  updateCollectionSpecificBanner
} from "actions/collection";
import { updatePartialProducts } from "actions/product";
import { getProductIdFromSlug } from "utils/url.ts";

const initActionSpecific: InitAction = async (dispatch, { slug }) => {
  const id = getProductIdFromSlug(slug);
  if (id) {
    const [filterData, bannerData] = await Promise.all([
      CollectionService.fetchCollectioSpecificData(id),
      CollectionService.fetchCollectioSpecificBanner(id)
    ]);
    const plpProduct: PartialProductItem[] = filterData.results;
    dispatch(updateCollectionSpecificData({ ...filterData }));
    dispatch(updateCollectionSpecificBanner({ ...bannerData }));
    dispatch(updatePartialProducts(plpProduct));
  }
};

export default initActionSpecific;
