import { InitAction } from "typings/actions";
import PlpService from "services/plp";

const initActionPLP: InitAction = async (dispatch, params, { search }) => {
  await PlpService.onLoadPlpPage(dispatch, search);
};

export default initActionPLP;
