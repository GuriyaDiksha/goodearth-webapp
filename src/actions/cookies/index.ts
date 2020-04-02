import { actionCreator } from "utils/actionCreator";
import { Cookies } from "typings/cookies";

export const updateCookies = (cookies: Cookies) =>
  actionCreator("UPDATE_COOKIE", cookies);
