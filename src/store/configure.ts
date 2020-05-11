import { createStore, compose, applyMiddleware } from "redux";
import { routerMiddleware } from "connected-react-router";

import { AppState } from "reducers/typings";
import createRootReducer from "reducers/root";
import { History } from "history";

// middlewares
import thunk from "redux-thunk";

export const configureStore = (
  client: boolean,
  history: History,
  initialState?: AppState
) => {
  const composeEnhancers =
    (client && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  return createStore(
    createRootReducer(history),
    initialState || {},
    composeEnhancers(applyMiddleware(thunk, routerMiddleware(history)))
  );
};
