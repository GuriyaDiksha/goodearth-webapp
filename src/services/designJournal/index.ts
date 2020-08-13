import { Dispatch } from "redux";
import API from "utils/api";
import { updateDesignJournal } from "actions/designJournal";

export default {
  onLoadDesignJournalBook: async (dispatch: Dispatch, url: string) => {
    const res = await API.get(
      dispatch,
      `${__API_HOST__}/myapi/promotions/design_journal/${url}`
    );
    dispatch(updateDesignJournal(res));
  }
};
