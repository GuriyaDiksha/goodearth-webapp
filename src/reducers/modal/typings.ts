import * as Actions from "actions/modal";
import { ActionType } from "typings/actionCreator";
import { ReactNode } from "react";

export type State = {
  component: ReactNode;
  openModal: boolean;
  fullscreen: boolean;
  bodyClass: string;
};

export type ModalActions = ActionType<typeof Actions>;
