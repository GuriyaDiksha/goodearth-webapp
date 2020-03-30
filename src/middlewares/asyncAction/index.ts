import { Middleware } from "redux";

const asyncMiddleware: Middleware = store => next => action => {
  if (typeof action === "function") {
    return action(store.dispatch, store.getState());
  } else {
    next(action);
  }
};

export default asyncMiddleware;
