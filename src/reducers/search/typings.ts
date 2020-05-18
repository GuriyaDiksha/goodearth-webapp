import * as Actions from "actions/search";
import { ActionType } from "typings/actionCreator";
import { PlpProps } from "containers/plp/typings";

export type State = {
  data: PlpProps;
  facetObject: any;
  searchProductId: number[];
  filterState: boolean;
  onload: boolean;
};

export { Actions };

export type SearchActions = ActionType<typeof Actions>;
