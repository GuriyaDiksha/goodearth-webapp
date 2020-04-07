import { actionCreator } from "utils/actionCreator";
import { ReactNode } from "react";

export const updateComponent = (component: ReactNode) =>
  actionCreator("UPDATE_COMPONENT", component);

export const updateModal = (data: boolean) =>
  actionCreator("UPDATE_MODAL", data);
