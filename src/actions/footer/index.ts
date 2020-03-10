import { actionCreator } from "utils/actionCreator";
import { FooterDataProps } from "components/footer/typings";

export const updatefooter = (data: FooterDataProps) =>
  actionCreator("UPDATE_FOOTER", data);
