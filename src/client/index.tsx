import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { configureStore } from "store/configure";
import { getHistory } from "routerHistory/index";

import App from "containers/app";

const history = getHistory();
const store = configureStore(true, history);

const application = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
);

window.onload = () => {
  const root = document.createElement("div");

  document.body.appendChild(root);
  render(application, root);
};
