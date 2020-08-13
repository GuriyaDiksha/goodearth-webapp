// modules
import loadable from "@loadable/component";
import { RouteConfig, ROUTES, RouteMap } from "./typings";
import { initAction, metaAction } from "containers/pdp";
import { initActionCollection } from "containers/collectionLanding";
import { initActionSpecific } from "containers/collectionSpecific";
import initActionPLP from "containers/plp/initAction";
import initActionSearch from "containers/search/initAction";
import initActionCategory from "containers/categoryLanding/initAction";
import initActionAccount from "containers/myAccount/initAction";
import initActionGiftcard from "containers/giftcard/initAction";
import initActionShop from "containers/shopLocator/initAction";
// import initActionDesignJournalBook from "containers/designJournalBook/initAction";

const paths: string[] = [];
const routeMap: RouteMap = {};

const routes: RouteConfig = [
  {
    path: ROUTES.CollectionLanding,
    component: loadable(() => import("containers/collectionLanding")),
    action: initActionCollection,
    exact: true
  },
  {
    path: ROUTES.CollectionSpecific,
    component: loadable(() => import("containers/collectionSpecific")),
    action: initActionSpecific,
    exact: true
  },
  {
    path: ROUTES.PLP,
    component: loadable(() => import("containers/plp")),
    action: initActionPLP,
    exact: false
  },
  {
    path: ROUTES.PDP,
    component: loadable(() => import("containers/pdp")),
    action: initAction,
    meta: metaAction,
    exact: true
  },
  {
    path: ROUTES.HOME,
    component: loadable(() => import("containers/home")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.SEARCH,
    component: loadable(() => import("containers/search")),
    action: initActionSearch,
    exact: true
  },
  {
    path: ROUTES.ACCOUNT,
    component: loadable(() => import("containers/myAccount")),
    action: initActionAccount,
    exact: false
  },
  {
    path: ROUTES.CAREER,
    component: loadable(() => import("containers/career")),
    action: async () => null,
    exact: false
  },
  {
    path: ROUTES.WISHLIST,
    component: loadable(() => import("containers/wishlist")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.CATEGORY,
    component: loadable(() => import("containers/categoryLanding")),
    action: initActionCategory,
    exact: true
  },
  {
    path: ROUTES.GIFTCARD,
    component: loadable(() => import("containers/giftcard")), // GiftCard,
    action: initActionGiftcard,
    exact: true
  },
  {
    path: ROUTES.ResetPassword,
    component: loadable(() => import("containers/resetPassword")), // ResetPassword,
    action: async () => null,
    exact: false
  },
  {
    path: ROUTES.STATIC,
    component: loadable(() => import("containers/customer")), // StaticPage,
    action: async () => null,
    exact: false
  },
  {
    path: ROUTES.CHECKOUT,
    component: loadable(() => import("containers/checkout")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.SHOP,
    component: loadable(() => import("containers/shopLocator")),
    action: initActionShop,
    exact: false
  },
  {
    path: ROUTES.ORDERCONFIRMATION,
    component: loadable(() => import("containers/orderConfirmation")),
    action: async () => null,
    exact: false
  },
  {
    path: ROUTES.PressStories,
    component: loadable(() => import("containers/pressStories")),
    action: async () => null,
    exact: false
  },
  {
    path: ROUTES.DESIGNJOURNAL,
    component: loadable(() => import("containers/designJournal")),
    action: async () => null,
    exact: true
  }
  // {
  //   path: ROUTES.DESIGNJOURNALBOOK,
  //   component: loadable(() => import("containers/designJournalBook")),
  //   action: initActionDesignJournalBook,
  //   exact: false
  // }
];

routes.forEach(route => {
  paths.push(route.path);
  routeMap[route.path] = route;
});

export { paths, routeMap, routes };
