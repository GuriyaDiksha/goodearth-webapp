import { InitAction } from "typings/actions";
import SearchService from "services/search";

const initActionSearch: InitAction = async (store, params, { search }) => {
  await SearchService.onLoadSearchPage(
    store.dispatch,
    search + `&page_size=${40}`,
    store.getState()?.currency,
    store.getState()?.info?.isSale
  ).catch(err => {
    console.log("Search Error API error", err);
  });
};

export default initActionSearch;
