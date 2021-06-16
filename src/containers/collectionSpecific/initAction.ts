import { InitAction } from "typings/actions";
import CollectionService from "services/collection";
import {
  updateCollectionSpecificData,
  updateCollectionSpecificBanner
} from "actions/collection";
import { updatePartialProducts } from "actions/product";
import { getProductIdFromSlug } from "utils/url";
import * as valid from "utils/validate";

const initActionSpecific: InitAction = async (
  store,
  { slug },
  location,
  currency
) => {
  const dispatch = store.dispatch;
  const id = getProductIdFromSlug(slug);
  if (id) {
    const [filterData, bannerData] = await Promise.all([
      CollectionService.fetchCollectioSpecificData(dispatch, id).catch(
        error => {
          console.log(`Collection Error id=${id}`, error);
        }
      ),
      CollectionService.fetchCollectioSpecificBanner(dispatch, id).catch(
        error => {
          console.log(`Collection Error id=${id}`, error);
        }
      )
    ]);
    const plpProduct: any = filterData && filterData.results;

    if (filterData) {
      valid.collectionProductImpression(
        filterData,
        "CollectionSpecific",
        currency || "INR"
      );
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
