import * as Actions from "actions/basket";
import { ActionType } from "typings/actionCreator";
import { Basket } from "typings/basket";

export type State = Basket;

export { Actions };

export type BasketActions = ActionType<typeof Actions>;
