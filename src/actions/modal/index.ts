import { actionCreator } from "utils/actionCreator";
import { ReactNode } from "react";

export const updateComponent = (
  component: ReactNode,
  fullscreen = false,
  bodyClass?: string
) => actionCreator("UPDATE_COMPONENT", { component, fullscreen, bodyClass });

export const updateModal = (data: boolean) =>
  actionCreator("UPDATE_MODAL", data);
