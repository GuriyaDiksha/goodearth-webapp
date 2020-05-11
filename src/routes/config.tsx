import { RouteConfig, ROUTES, RouteMap } from "./typings";
import Home from "containers/home";
import PDPContainer, { initAction, metaAction } from "containers/pdp";
import CollectionLanding, {
  initActionCollection
} from "containers/collectionLanding";
import CollectionSpecific, {
  initActionSpecific
} from "containers/collectionSpecific";
import initActionPLP from "containers/plp/initAction";
import PLP from "containers/plp";

const paths: string[] = [];
const routeMap: RouteMap = {};

const routes: RouteConfig = [
  {
    path: ROUTES.CollectionLanding,
    component: CollectionLanding,
    action: initActionCollection,
    exact: true
  },
  {
    path: ROUTES.CollectionSpecific,
    component: CollectionSpecific,
    action: initActionSpecific,
    exact: true
  },
  {
    path: ROUTES.PLP,
    component: PLP,
    action: initActionPLP,
    exact: false
  },
  {
    path: ROUTES.PDP,
    component: PDPContainer,
    action: initAction,
    meta: metaAction,
    exact: true
  },
  {
    path: ROUTES.HOME,
    component: Home,
    action: async () => null,
    exact: true
  }
];

routes.forEach(route => {
  paths.push(route.path);
  routeMap[route.path] = route;
});

export { paths, routeMap, routes };
