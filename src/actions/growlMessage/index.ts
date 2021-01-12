import { ReactElement } from "react";
import { actionCreator } from "utils/actionCreator";

export const showMessage = (
  text: string | (string | JSX.Element)[] | ReactElement,
  timeout: number,
  id: string
) =>
  actionCreator("SHOW_MESSAGE", {
    text,
    timeout,
    id
  });

export const hideMessage = (id: string) =>
  actionCreator("HIDE_MESSAGE", { id });
