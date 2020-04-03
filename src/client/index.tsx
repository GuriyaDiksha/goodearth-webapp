import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { configureStore } from "store/configure";
import { getHistory } from "routerHistory/index";
import { getDevice } from "utils/device";
import CookieService from "services/cookie";

import App from "containers/app";
import { updateDeviceInfo } from "actions/device";
import initAction from "./initAction";
import { updateCookies } from "actions/cookies";
document.cookie = "tkn=a66e5385d467e8d52d9e61eebeb6764f4b7c769b";
const history = getHistory();
const store = configureStore(true, history);
const cookies = CookieService.parseCookies(document.cookie);
store.dispatch(updateCookies(cookies));

initAction(store);
const { mobile, tablet } = getDevice(window.navigator.userAgent);
store.dispatch(updateDeviceInfo(mobile, tablet));

const application = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
);

window.onload = () => {
  const root = document.createElement("div");
  const modalContainer = document.createElement("div");
  modalContainer.id = "modal-container";
  document.body.appendChild(modalContainer);
  document.body.appendChild(root);
  render(application, root);
};

export default store;
