import * as Actions from "actions/modal";
import { ActionType } from "typings/actionCreator";

export type State = {
  component: string;
  props: any;
  openModal: boolean;
  fullscreen: boolean;
  bodyClass: string;
};

export type ModalActions = ActionType<typeof Actions>;
