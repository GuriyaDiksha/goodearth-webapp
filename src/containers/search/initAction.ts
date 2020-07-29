import { InitAction } from "typings/actions";
import SearchService from "services/search";

const initActionSearch: InitAction = async (dispatch, params, { search }) => {
  await SearchService.onLoadSearchPage(dispatch, search);
};

export default initActionSearch;
