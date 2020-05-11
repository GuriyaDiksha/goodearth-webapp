import React from "react";
import { hydrate } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { configureStore } from "store/configure";
import { getHistory } from "routerHistory/index";
// import { getDevice } from "utils/device";
// import CookieService from "services/cookie";

import App from "containers/app";
// import { updateDeviceInfo } from "actions/device";
// import initAction from "actions/initAction";
// import { updateCookies } from "actions/cookies";

const history = getHistory();
const initialState = window.state;
const store = configureStore(true, history, initialState);
// const cookies = CookieService.parseCookies(document.cookie);
// store.dispatch(updateCookies(cookies));

// initAction(store);
// const { mobile, tablet } = getDevice(window.navigator.userAgent);
// store.dispatch(updateDeviceInfo(mobile, tablet));

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
};

export default store;
