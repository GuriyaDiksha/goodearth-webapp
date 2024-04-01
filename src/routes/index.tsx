import React from "react";
import { Route } from "react-router-dom";
import { routes } from "./config";
import RouteContainer from "containers/route";
// import maintenance from "containers/maintenance";

function ErrorHandler({ error }: any) {
  console.log("errorHandler....");
  return (
    <div role="alert">
      <p>An error occurred:</p>
      <pre>{error?.message}</pre>
    </div>
  );
}
const routeMap = routes.map(({ path, component, action, exact, meta }) => {
  try {
    return (
      <Route
        key={path}
        path={path}
        exact={exact}
        render={({ match: { params }, location }) => {
          const myParams = { ...params };
          myParams.pathname = location.pathname;
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
  } catch (error) {
    return <ErrorHandler error={error} />;
  }
});

export default routeMap;
