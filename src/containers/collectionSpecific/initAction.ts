import { InitAction } from "typings/actions";
import CollectionService from "services/collection";
import {
  updateCollectionSpecificData,
  updateCollectionSpecificBanner
} from "actions/collection";
import { getProductIdFromSlug } from "utils/url.ts";

const initActionSpecific: InitAction = async (dispatch, { slug }) => {
  const id = getProductIdFromSlug(slug);
  if (id) {
    const [filterData, bannerData] = await Promise.all([
      CollectionService.fetchCollectioSpecificData(id),
      CollectionService.fetchCollectioSpecificBanner(id)
    ]);
    dispatch(updateCollectionSpecificData({ ...filterData }));
    dispatch(updateCollectionSpecificBanner({ ...bannerData }));
  }
};

export default initActionSpecific;
