import React from "react";
import { Route } from "react-router-dom";
import { routes } from "./config";
import RouteContainer from "containers/route";

const routeMap = routes.map(({ path, component, action, exact }) => {
  return (
    <Route
      key={path}
      path={path}
      exact={exact}
      render={({ match: { params } }) => {
        return (
          <RouteContainer
            action={action}
            component={component}
            path={path}
            params={params}
          />
        );
      }}
    />
  );
});

export default routeMap;
