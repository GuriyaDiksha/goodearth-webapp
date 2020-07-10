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
import { plplist } from "./plp";
import { growlMessage } from "./growlMessage";
import { meta } from "./meta";
import { searchList } from "./search";
import { category } from "./category";
import { address } from "./address";
import { shop } from "./shop";

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
    plplist,
    meta,
    message: growlMessage,
    searchList,
    category,
    address,
    shop
  });
};

export default createRootReducer;
