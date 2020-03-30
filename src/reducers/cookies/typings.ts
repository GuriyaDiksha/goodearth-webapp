import * as Actions from "actions/cookies";
import { ActionType } from "typings/actionCreator";
import { Cookies } from "typings/cookies";

export type State = Cookies;

export { Actions };

export type CookiesActions = ActionType<typeof Actions>;
