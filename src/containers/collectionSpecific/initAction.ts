import { InitAction } from "typings/actions";
import CollectionService from "services/collection";
import {
  updateCollectionSpecificData,
  updateCollectionSpecificBanner
} from "actions/collection";
// import { getParamsFromString } from "utils/url.ts";

const initActionSpecific: InitAction = async (dispatch, { slug }) => {
  // const id = getParamsFromString(slug);

  // if (20) {
  const [filterData, bannerData] = await Promise.all([
    CollectionService.fetchCollectioSpecificData(378),
    CollectionService.fetchCollectioSpecificBanner(60)
  ]);
  dispatch(updateCollectionSpecificData({ ...filterData }));
  dispatch(updateCollectionSpecificBanner({ ...bannerData }));
  // }
};

export default initActionSpecific;
