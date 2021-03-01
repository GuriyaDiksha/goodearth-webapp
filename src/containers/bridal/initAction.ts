import { InitAction } from "../../typings/actions";
import Api from "../../services/api";

const initActionBridal: InitAction = async (
  store,
  params,
  location,
  currency
) => {
  const dispatch = store.dispatch;
  const pathArray = location.pathname.split("/");
  const isBridal =
    pathArray.includes("bridal") && !pathArray.includes("account");
  let bridalKey = "";
  if (isBridal) {
    bridalKey = pathArray[pathArray.indexOf("bridal") + 1];
  }
  await Api.getAnnouncement(dispatch, bridalKey);
};
export default initActionBridal;
