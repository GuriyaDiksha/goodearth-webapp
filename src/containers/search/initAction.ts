import { InitAction } from "typings/actions";
import SearchService from "services/search";

const initActionSearch: InitAction = async (dispatch, params, { search }) => {
  await SearchService.onLoadSearchPage(dispatch, search).catch(err => {
    console.log("Search Error API error", err);
  });
};

export default initActionSearch;
