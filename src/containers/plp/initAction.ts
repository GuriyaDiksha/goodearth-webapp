import { InitAction } from "typings/actions";
import PlpService from "services/plp";
// import {
//   updateCollectionFilter,
// } from "actions/collection";
// import { getParamsFromString } from "utils/url.ts";

const initActionPLP: InitAction = async (dispatch, params, { search }) => {
  await PlpService.onLoadPlpPage(dispatch, search);
};

export default initActionPLP;
