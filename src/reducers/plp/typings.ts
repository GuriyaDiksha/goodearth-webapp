import * as Actions from "actions/plp";
import { ActionType } from "typings/actionCreator";
import { PlpProps } from "containers/plp/typings";

export type State = {
  data: PlpProps;
  facetObject: any;
};

export { Actions };

export type PlpActions = ActionType<typeof Actions>;
