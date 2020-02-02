import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { configureStore } from "store/configure";
import { getHistory } from "routerHistory/index";

import routes from "routes/index";
import { Switch } from "react-router";

const history = getHistory();
const store = configureStore(true, history);

const App: React.FC<any> = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>{routes}</Switch>
      </ConnectedRouter>
    </Provider>
  );
};

window.onload = () => {
  const root = document.createElement("div");
  document.body.appendChild(root);

  render(<App />, root);
};
