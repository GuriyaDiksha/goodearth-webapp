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
    pathArray.includes("registry") && !pathArray.includes("account");
  let bridalKey = "";
  if (isBridal) {
    bridalKey = pathArray[pathArray.indexOf("registry") + 1];
  }
  await Api.getAnnouncement(dispatch, bridalKey);
};
export default initActionBridal;
