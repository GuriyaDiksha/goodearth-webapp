import { DesignJournalActions } from "./typings";
import { DesignJournalBookData } from "../../containers/designJournalBook/typings";

const initialState: DesignJournalBookData = {
  mainProduct: {
    name: "",
    price: {
      INR: 0,
      USD: 0,
      GBP: 0
    },
    currency: "INR",
    image: "",
    sku: "",
    url: ""
  },
  imageData: []
};
export const designJournal = (
  state = initialState,
  action: DesignJournalActions
) => {
  switch (action.type) {
    case "UPDATE_DESIGN_JOURNAL":
      return {
        ...state,
        ...action.payload
      };
  }
};
