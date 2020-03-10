import React from "react";
import { RouteConfig, ROUTES, RouteMap } from "./typings";
import Home from "containers/home";
import PDPContainer, { initAction } from "containers/pdp";

const paths: string[] = [];
const routeMap: RouteMap = {};

const routes: RouteConfig = [
  {
    path: ROUTES.HOME,
    component: () => <Home />,
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.PDP,
    component: PDPContainer,
    action: initAction,
    exact: true
  }
];

routes.forEach(route => {
  paths.push(route.path);
  routeMap[route.path] = route;
});

export { paths, routeMap, routes };
