import { actionCreator } from "utils/actionCreator";

export const updateComponent = (
  component: string,
  props: any,
  fullscreen = false,
  bodyClass?: string
) =>
  actionCreator("UPDATE_COMPONENT", {
    component,
    props,
    fullscreen,
    bodyClass
  });

export const updateModal = (data: boolean) =>
  actionCreator("UPDATE_MODAL", data);
