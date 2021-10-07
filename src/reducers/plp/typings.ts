import * as Actions from "actions/plp";
import { ActionType } from "typings/actionCreator";
import { PlpProps } from "containers/plp/typings";
import { PlpTemplatesData } from "services/plp/typings";

export type State = {
  data: PlpProps;
  facetObject: any;
  plpProductId: number[];
  filterState: boolean;
  onload: boolean;
  plpMobileView: "list" | "grid";
  plpTemplates: PlpTemplatesData;
};

export { Actions };

export type PlpActions = ActionType<typeof Actions>;
