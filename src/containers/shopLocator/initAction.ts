import { InitAction } from "typings/actions";
import Shop from "services/api";

const initActionShop: InitAction = async store => {
  await Shop.fetchShopLocator(store.dispatch);
};

export default initActionShop;
