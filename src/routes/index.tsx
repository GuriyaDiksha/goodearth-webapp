import React from "react";
import { Route } from "react-router-dom";
import { routes } from "./config";
import RouteContainer from "containers/route";

const routeMap = routes.map(({ path, component, action, exact, meta }) => {
  return (
    <Route
      key={path}
      path={path}
      exact={exact}
      render={({ match: { params } }) => {
        const myParams = { ...params };
        return (
          <RouteContainer
            action={action}
            component={component}
            path={path}
            params={myParams}
            meta={meta}
          />
        );
      }}
    />
  );
});

export default routeMap;
