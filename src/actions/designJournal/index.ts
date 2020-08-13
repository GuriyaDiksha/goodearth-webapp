import { actionCreator } from "utils/actionCreator";

export const updateDesignJournal = (data: any) =>
  actionCreator("UPDATE_DESIGN_JOURNAL", data);
