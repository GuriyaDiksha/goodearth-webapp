import { ReactElement } from "react";
import { actionCreator } from "utils/actionCreator";

export const showMessage = (text: string | ReactElement, timeout?: number) =>
  actionCreator("SHOW_MESSAGE", {
    text,
    timeout
  });

export const hideMessage = () => actionCreator("HIDE_MESSAGE", {});
