import * as Actions from "actions/plp";
import { ActionType } from "typings/actionCreator";
import { PlpProps } from "containers/plp/typings";

export type State = {
  data: PlpProps;
  facetObject: any;
  plpProductId: number[];
  filterState: boolean;
};

export { Actions };

export type PlpActions = ActionType<typeof Actions>;
