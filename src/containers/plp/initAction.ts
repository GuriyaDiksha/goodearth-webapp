import { InitAction } from "typings/actions";
import PlpService from "services/plp";

const initActionPLP: InitAction = async (
  store,
  params,
  { search },
  currency
) => {
  const dispatch = store.dispatch;
  await PlpService.onLoadPlpPage(dispatch, search, currency || "INR").catch(
    error => {
      console.log("PLP SERVER ", error);
    }
  );
};

export default initActionPLP;
