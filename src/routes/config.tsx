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
import Search from "containers/search";
import initActionSearch from "containers/search/initAction";
import myAccount from "containers/myAccount";
import initActionCategory from "containers/categoryLanding/initAction";
import CategoryLanding from "containers/categoryLanding/index";
import initActionAccount from "containers/myAccount/initAction";
import Career from "containers/career";
import Wishlist from "containers/wishlist";

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
  },
  {
    path: ROUTES.SEARCH,
    component: Search,
    action: initActionSearch,
    exact: true
  },
  {
    path: ROUTES.ACCOUNT,
    component: myAccount,
    action: initActionAccount,
    exact: false
  },
  {
    path: ROUTES.CAREER,
    component: Career,
    action: async () => null,
    exact: false
  },
  {
    path: ROUTES.WISHLIST,
    component: Wishlist,
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.CATEGORY,
    component: CategoryLanding,
    action: initActionCategory,
    exact: true
  }
];

routes.forEach(route => {
  paths.push(route.path);
  routeMap[route.path] = route;
});

export { paths, routeMap, routes };
