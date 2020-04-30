import { Cookies } from "typings/cookies";

export default {
  parseCookies: (cookieString: string) => {
    const keyPairs = cookieString.split(";");
    const cookies: Cookies = {};
    keyPairs.forEach(str => {
      const [key, value] = str.trim().split("=");
      if (key) {
        cookies[key.trim()] = value.trim();
      }
    });

    return cookies;
  }
};
