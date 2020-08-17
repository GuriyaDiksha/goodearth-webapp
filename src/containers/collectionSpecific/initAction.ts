import { InitAction } from "typings/actions";
import CollectionService from "services/collection";
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
      CollectionService.fetchCollectioSpecificData(id).catch(error => {
        console.log(`Collection Error id=${id}`, error);
      }),
      CollectionService.fetchCollectioSpecificBanner(id).catch(error => {
        console.log(`Collection Error id=${id}`, error);
      })
    ]);
    const plpProduct: any = filterData && filterData.results;

    if (filterData) {
      dispatch(updateCollectionSpecificData({ ...filterData }));
    }
    if (bannerData) {
      dispatch(updateCollectionSpecificBanner({ ...bannerData }));
    }
    if (plpProduct) {
      dispatch(updatePartialProducts(plpProduct));
    }
  }
};

export default initActionSpecific;
