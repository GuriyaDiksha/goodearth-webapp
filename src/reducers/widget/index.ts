import { State, WidgetActions } from "./typing";

const initialState: State = {
  region: "",
  widgetDetail: null,
  consentDetail: null,
  country: "",
  ip: ""
};

export const widget = (state = initialState, action: WidgetActions): State => {
  switch (action.type) {
    case "UPDATE_REGION": {
      return {
        ...state,
        ...action?.payload
      };
    }
    case "UPDATE_WIDGET_DETAIL": {
      return { ...state, widgetDetail: action.payload };
    }
    case "UPDATE_CONSENT_DETAIL": {
      return { ...state, consentDetail: action.payload };
    }
  }

  return state;
};
