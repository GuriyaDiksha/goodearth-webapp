import { InitAction } from "typings/actions";
import CollectionService from "services/collection";

import {
  updateCollectionFilter,
  updateCollectionData
} from "actions/collection";
import { getProductIdFromSlug } from "utils/url.ts";

const initActionCollection: InitAction = async (store, params) => {
  const id = getProductIdFromSlug(params.level1);
  const dispatch = store.dispatch;
  if (id) {
    const [filterData, collectionData] = await Promise.all([
      CollectionService.fetchCollectionMapping(dispatch, id, params.id).catch(
        err => {
          console.log("Collection Landing Error", err);
        }
      ),
      CollectionService.fetchCollectionData(dispatch, +params.id).catch(err => {
        console.log("Collection Landing Error", err);
      })
    ]);
    if (filterData) {
      dispatch(updateCollectionFilter({ ...filterData }));
    }
    if (collectionData) {
      dispatch(updateCollectionData(collectionData));
    }
  }
};

export default initActionCollection;
