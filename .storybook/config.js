import React from "react";
import { configure, addDecorator } from "@storybook/react";

import { combineReducers } from "redux";
import { connectRouter, ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";

import styles from "../src/styles/global.scss";

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history)
  });
const history = createBrowserHistory();
const store = createStore(
  createRootReducer(history),
  {},
  compose(applyMiddleware(routerMiddleware(history)))
);

const withProvider = story => (
  <div style={{ padding: "10px" }}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/" render={() => story()} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  </div>
);

addDecorator(withProvider);

configure(require.context("../src", true, /stories\.tsx$/), module);
