import * as Actions from "actions/home";
import { ActionType } from "typings/actionCreator";

export type HomeState = {
  section1: any;
  section2: any;
  section3: any;
};

export type HomeActions = ActionType<typeof Actions>;
