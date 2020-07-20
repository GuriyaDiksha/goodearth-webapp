import { actionCreator } from "utils/actionCreator";

export const updateShopData = (data: any) =>
  actionCreator("UPDATE_SHOP_DATA", data);
