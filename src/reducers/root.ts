import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { History } from "history";

import { user } from "./user";
import { currency } from "./currency";
import { device } from "./device";
import { product } from "./product";
import { header } from "./header";
import { footer } from "./footer";
import { cookies } from "./cookies";
import { wishlist } from "./wishlist";
import { basket } from "./basket";

const createRootReducer = (history: History) => {
  return combineReducers({
    router: connectRouter(history),
    footer,
    user,
    device,
    currency,
    header,
    products: product,
    cookies,
    wishlist,
    basket
  });
};

export default createRootReducer;
