import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { History } from "history";

import { user } from "./user";
import { currency } from "./currency";
import { device } from "./device";
import { product } from "./product";

const createRootReducer = (history: History) => {
  return combineReducers({
    router: connectRouter(history),
    user,
    device,
    currency,
    products: product
  });
};

export default createRootReducer;
