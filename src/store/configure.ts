import { createStore, compose } from "redux";

import { AppState } from "reducers/typings";
import rootReducer from "reducers/root";

export const configureStore = (client: boolean, initialState?: AppState) => {
  const composeEnhancers =
    (client && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  return createStore(rootReducer, initialState || {}, composeEnhancers());
};
