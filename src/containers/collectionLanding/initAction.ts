// import { InitAction } from "typings/actions";
// import CollectionService from "services/collection";

// import { updateTagsData, updateCollectionData } from "actions/collection";

// const initActionCollection: InitAction = async (store, params) => {
// const id = getProductIdFromSlug(params.level1);
// const dispatch = store.dispatch;
// if (params.id) {
//   const [tags, collectionData] = await Promise.all([
//     CollectionService.fetchTagData(dispatch, +params.id).catch(err => {
//       console.log("Collection Landing Error", err);
//     }),
//     CollectionService.fetchCollectionData(dispatch, +params.id).catch(err => {
//       console.log("Collection Landing Error", err);
//     })
//   ]);

//   if (tags) {
//     dispatch(updateTagsData(tags));
//   }
//   if (collectionData) {
//     dispatch(updateCollectionData(collectionData));
//   }
// }
// };

// export default initActionCollection;
