import React from "react";
import { Route } from "react-router-dom";
import { routes } from "./config";
import RouteContainer from "containers/route";
import maintenance from "containers/maintenance";
const routeMap = routes.map(({ path, component, action, exact, meta }) => {
  return (
    <Route
      key={path}
      path={path}
      exact={exact}
      render={({ match: { params }, location }) => {
        const myParams = { ...params };
        myParams.pathname = location.pathname;
        if (location.pathname == "/maintenance") {
          return (
            <RouteContainer
              action={action}
              component={maintenance}
              path={path}
              params={myParams}
              meta={meta}
            />
          );
        } else {
          return (
            <RouteContainer
              action={action}
              component={component}
              path={path}
              params={myParams}
              meta={meta}
            />
          );
        }
      }}
    />
  );
});

export default routeMap;
