import { FooterState, DeviceActions } from "./typings";

const initialState: FooterState = {
  data: {
    footerList: [],
    footerPlaylistData: {
      ctaImage: "",
      ctaText: "",
      ctaUrl: ""
    },
    shopLocations: [],
    footerImages: {
      footerImageDeskTop: "",
      footerImageMobile: "",
      footerImageSubsDeskTop: "",
      footerImageSubsMobile: "",
      footerBgColorDeskTop: "",
      footerBgColorMobile: ""
    },
    findUsOnData: []
  }
};

export const footer = (
  state: FooterState = initialState,
  action: DeviceActions
) => {
  switch (action.type) {
    case "UPDATE_FOOTER": {
      const newState = { ...state };
      newState.data = action.payload;
      {
        return { ...newState };
      }
    }
  }
  return state;
};
