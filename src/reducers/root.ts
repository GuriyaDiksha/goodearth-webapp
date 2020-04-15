import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { History } from "history";

import { user } from "./user";
import { currency } from "./currency";
import { device } from "./device";
import { product } from "./product";
import { header } from "./header";
import { footer } from "./footer";
import { collection } from "./collection";
import { cookies } from "./cookies";
import { wishlist } from "./wishlist";
import { basket } from "./basket";
import { quickview } from "./quickview";
import { modal } from "./modal";
import { growlMessage } from "./growlMessage";

const createRootReducer = (history: History) => {
  return combineReducers({
    router: connectRouter(history),
    footer,
    user,
    device,
    currency,
    header,
    collection,
    products: product,
    cookies,
    wishlist,
    basket,
    quickview,
    modal,
    message: growlMessage
  });
};

export default createRootReducer;
