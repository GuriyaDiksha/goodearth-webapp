import { actionCreator } from "utils/actionCreator";
import { User } from "typings/user";

export const updateUser = (user: Partial<User>) =>
  actionCreator("UPDATE_USER", user);

export const refreshPage = (data: string | undefined) =>
  actionCreator("REFRESH_PAGE", data);
