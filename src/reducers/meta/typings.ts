import * as Actions from "actions/meta";
import { PageMeta } from "typings/meta";
import { ActionType } from "typings/actionCreator";

export type State = PageMeta;

export { Actions };

export type MetaActions = ActionType<typeof Actions>;
