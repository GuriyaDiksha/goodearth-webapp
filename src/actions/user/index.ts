import { actionCreator } from "utils/actionCreator";
import { User } from "typings/user";

export const updateUser = (user: Partial<User>) =>
  actionCreator("UPDATE_USER", user);

export const refreshPage = (data: string | undefined) =>
  actionCreator("REFRESH_PAGE", data);

export const resetMeta = (data: string | undefined) =>
  actionCreator("RESET_META", data);

export const updatePreferenceData = (data: any) =>
  actionCreator("UPDATE_PREFERENCE_DATA", data);
