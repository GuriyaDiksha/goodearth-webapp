import { actionCreator } from "utils/actionCreator";

export const showMessage = (
  text: string | Element,
  timeout: number,
  id: string,
  params?: any
) =>
  actionCreator("SHOW_MESSAGE", {
    text,
    timeout,
    id,
    params
  });

export const hideMessage = (id: string) =>
  actionCreator("HIDE_MESSAGE", { id });
