import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { configureStore } from "store/configure";
import { getHistory } from "routerHistory/index";
import { getDevice } from "utils/device";

import App from "containers/app";
import { updateDeviceInfo } from "actions/device";
import initAction from "./initAction";

const history = getHistory();
const store = configureStore(true, history);

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
