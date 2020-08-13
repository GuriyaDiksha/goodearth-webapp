import { InitAction } from "typings/actions";
import CollectionService from "services/collection";

import {
  updateCollectionFilter,
  updateCollectionData
} from "actions/collection";
import { getProductIdFromSlug } from "utils/url.ts";

const initActionCollection: InitAction = async (dispatch, params) => {
  const id = getProductIdFromSlug(params.level1);
  if (id) {
    const [filterData, collectionData] = await Promise.all([
      CollectionService.fetchCollectionMapping(id, params.id),
      CollectionService.fetchCollectionData(+params.id)
    ]);
    dispatch(updateCollectionFilter({ ...filterData }));
    dispatch(updateCollectionData(collectionData));
  }
};

export default initActionCollection;
