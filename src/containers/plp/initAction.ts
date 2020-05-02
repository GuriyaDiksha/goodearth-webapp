import { InitAction } from "typings/actions";
import PlpService from "services/plp";
import { updateProduct } from "actions/plp";
// import {
//   updateCollectionFilter,
// } from "actions/collection";
// import { getParamsFromString } from "utils/url.ts";

const initActionPLP: InitAction = async (dispatch, { search }) => {
  const [plpList] = await Promise.all([
    PlpService.fetchPlpProducts(dispatch, search)
  ]);
  dispatch(updateProduct({ ...plpList }));
};

export default initActionPLP;
