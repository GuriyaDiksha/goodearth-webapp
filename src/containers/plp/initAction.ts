import { InitAction } from "typings/actions";
import PlpService from "services/plp";

const initActionPLP: InitAction = async (dispatch, params, { search }) => {
  await PlpService.onLoadPlpPage(dispatch, search).catch(error => {
    console.log("PLP SERVER ", error);
  });
};

export default initActionPLP;
