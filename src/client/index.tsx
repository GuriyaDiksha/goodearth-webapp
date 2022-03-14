import React from "react";
import { hydrate } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { configureStore } from "store/configure";
import { getHistory } from "routerHistory/index";
import debounce from "lodash/debounce";
// import { getDevice } from "utils/device";
// import CookieService from "services/cookie";

import App from "containers/app";
import { getDevice } from "utils/device";
import { updateDeviceInfo } from "actions/device";
// import { updateDeviceInfo } from "actions/device";
// import initAction from "actions/initAction";
// import { updateCookies } from "actions/cookies";

const history = getHistory();
const initialState = window.state;
const store = configureStore(true, history, initialState);
// const cookies = CookieService.parseCookies(document.cookie);
// store.dispatch(updateCookies(cookies));

// initAction(store);

const application = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
);

window.onload = () => {
  const root = document.getElementById("main");

  // document.body.appendChild(modalContainer);
  // document.body.appendChild(root);
  hydrate(application, root);
  const updatedDevice = getDevice(window.navigator.userAgent);
  const mobile = updatedDevice.mobile || window.innerWidth < 992;
  const orientation: "landscape" | "portrait" =
    window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  store.dispatch(updateDeviceInfo(mobile, updatedDevice.tablet, orientation));
  window.addEventListener(
    "resize",
    debounce(() => {
      const updatedDevice = getDevice(window.navigator.userAgent);
      const mobile = updatedDevice.mobile || window.innerWidth < 992;
      const orientation: "landscape" | "portrait" =
        window.innerWidth > window.innerHeight ? "landscape" : "portrait";
      if (document.body.hasAttribute("style")) {
        document.body.removeAttribute("style");
      }
      store.dispatch(
        updateDeviceInfo(mobile, updatedDevice.tablet, orientation)
      );
    }, 100)
  );
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      const updatedDevice = getDevice(window.navigator.userAgent);
      const mobile = updatedDevice.mobile || window.innerWidth < 992;
      const orientation: "landscape" | "portrait" =
        window.innerWidth > window.innerHeight ? "landscape" : "portrait";
      store.dispatch(
        updateDeviceInfo(mobile, updatedDevice.tablet, orientation)
      );
    }, 100);
  });
};

export default store;
