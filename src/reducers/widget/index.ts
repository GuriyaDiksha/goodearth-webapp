import { State, WidgetActions } from "./typing";

const initialState: State = { region: "", widgetDetail: null };

export const widget = (state = initialState, action: WidgetActions): State => {
  switch (action.type) {
    case "UPDATE_REGION": {
      return { ...state, region: action.payload };
    }
    case "UPDATE_WIDGET_DETAIL": {
      return { ...state, widgetDetail: action.payload };
    }
  }

  return state;
};
