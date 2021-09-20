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
  },
  getCookie(cname: string) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },

  setCookie(cname: string, cvalue: string, exdays = 30) {
    if (exdays === 0) {
      document.cookie = cname + "=" + cvalue + ";path=/";
    } else {
      const d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      const expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
  }
};
