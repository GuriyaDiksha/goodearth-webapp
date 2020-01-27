import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import { user } from "./user";
import { currency } from "./currency";
import { device } from "./device";
import { getHistory } from "routerHistory/index";

const history = getHistory();

const rootReducer = combineReducers({
  router: connectRouter(history),
  user,
  device,
  currency
});

export default rootReducer;
