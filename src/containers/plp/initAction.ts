import { InitAction } from "typings/actions";
import PlpService from "services/plp";

const initActionPLP: InitAction = async (
  store,
  params,
  { search },
  currency
) => {
  const dispatch = store.dispatch;
  const categoryShop = new URLSearchParams(search).get("category_shop");
  const promises: any[] = [
    PlpService.onLoadPlpPage(dispatch, search, currency || "INR").catch(
      error => {
        console.log("PLP SERVER ", error);
      }
    )
  ];
  if (categoryShop) {
    promises.push(
      PlpService.fetchPlpTemplates(dispatch, categoryShop).catch(error => {
        console.log("Fetch PLP Templates error!! ", error);
      })
    );
  }
  await Promise.all(promises);
};

export default initActionPLP;
