import { InitAction } from "typings/actions";
// import CollectionService from "services/collection";

// import {
//   updateCollectionFilter,
//   updateCollectionData
// } from "actions/collection";
// import { getParamsFromString } from "utils/url.ts";

const initActionCheckout: InitAction = async (
  dispatch,
  params = {},
  { search }
) => {
  //   const id = getParamsFromString(search);
  //   if (id) {
  //     const [filterData, collectionData] = await Promise.all([
  //       CollectionService.fetchCollectionMapping(id),
  //       CollectionService.fetchCollectionData(id)
  //     ]);
  //     dispatch(updateCollectionFilter({ ...filterData }));
  //     dispatch(updateCollectionData(collectionData));
  //   }
};

export default initActionCheckout;
