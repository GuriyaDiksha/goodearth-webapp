import * as Actions from "actions/currency";
import { Currency } from "typings/currency";
import { ActionType } from "typings/actionCreator";

export type State = Currency;

export type CurrencyActions = ActionType<typeof Actions>;
