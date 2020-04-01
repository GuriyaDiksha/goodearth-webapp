import { actionCreator } from "utils/actionCreator";
import { Basket } from "typings/basket";

export const updateBasket = (basket: Basket) =>
  actionCreator("UPDATE_BASKET", basket);
