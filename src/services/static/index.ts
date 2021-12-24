import { Dispatch } from "redux";
import API from "utils/api";

export default {
  fetchTerms: async (dispatch: Dispatch, link: string) => {
    const res = await API.post<{ link: string; content: string }>(
      dispatch,
      `${__API_HOST__}/myapi/static/fetch_page_content/`,
      {
        link: link + "/"
      }
    );
    return res;
  }
};
