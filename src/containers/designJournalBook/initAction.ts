import { Store } from "redux";
import DesignJournalService from "services/designJournal";
import { InitAction } from "typings/actions";

const initActionDesignJournalBook: InitAction = async (
  store: Store,
  params,
  { search }
) => {
  DesignJournalService.onLoadDesignJournalBook(store.dispatch, search).catch(
    err => {
      console.log("Design Journal Error", err);
    }
  );
};

export default initActionDesignJournalBook;
