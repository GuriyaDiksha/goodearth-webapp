import { InitAction } from "typings/actions";
import Shop from "services/api";

const initActionShop: InitAction = async dispatch => {
  await Shop.fetchShopLocator(dispatch);
};

export default initActionShop;
