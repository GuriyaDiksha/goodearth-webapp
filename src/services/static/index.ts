import { Dispatch } from "redux";
import API from "utils/api";

export default {
  fetchTerms: async (dispatch: Dispatch, pageTitle: string) => {
    const res = await API.post<{ link: string; content: string }>(
      dispatch,
      "https://db.goodearth.in/myapi/static/fetch_page_content/",
      {
        pageTitle
      }
    );
    return res;
  }
};
