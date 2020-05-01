import { State, MetaActions } from "./typings";

const initialState: State = {
  keywords: "",
  description: "",
  title: "",
  ogTitle: "",
  ogUrl: "",
  ogImage: "",
  ogImageHeight: "",
  ogImageWidth: "",
  ogDescription: "",
  ogSiteName: "",
  ogType: "",
  isChat: false,
  templateType: "",
  productClass: "",
  twitterCard: "",
  twitterTitle: "",
  twitterUrl: "",
  twitterDescription: "",
  twitterImage: "",
  twitterDomain: "",
  twitterCreator: "",
  twitterSite: ""
};

export const meta = (state = initialState, action: MetaActions): State => {
  switch (action.type) {
    case "UPDATE_PAGE_META": {
      return { ...state, ...action.payload };
    }
    case "RESET_PAGE_META": {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
