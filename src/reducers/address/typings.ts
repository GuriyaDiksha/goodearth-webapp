import * as Actions from "actions/address";
import { ActionType } from "typings/actionCreator";
import { AddressData } from "../../components/Address/typings";

export type State = AddressData[];

export { Actions };

export type AddressActions = ActionType<typeof Actions>;
