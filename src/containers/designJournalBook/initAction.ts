import { Dispatch } from "redux";
import DesignJournalService from "services/designJournal";
import { InitAction } from "typings/actions";

const initActionDesignJournalBook: InitAction = async (
  dispatch: Dispatch,
  params,
  { search }
) => {
  DesignJournalService.onLoadDesignJournalBook(dispatch, search).catch(err => {
    console.log("Design Journal Error", err);
  });
};

export default initActionDesignJournalBook;
