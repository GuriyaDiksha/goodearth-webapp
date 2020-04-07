import * as Actions from "actions/modal";
import { ActionType } from "typings/actionCreator";
import { ReactNode } from "react";

export type State = {
  component: ReactNode;
  openModal: boolean;
};

export type ModalActions = ActionType<typeof Actions>;
