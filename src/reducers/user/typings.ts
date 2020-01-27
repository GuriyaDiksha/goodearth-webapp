import * as Actions from "actions/user";
import { User } from "typings/user";
import { ActionType } from "typings/actionCreator";

export type State = User;

export { Actions };

export type UserActions = ActionType<typeof Actions>;
