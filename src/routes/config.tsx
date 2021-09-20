// modules
import loadable from "@loadable/component";
import { RouteConfig, ROUTES, RouteMap } from "./typings";
import initAction from "containers/pdp/initAction";
import metaAction from "containers/pdp/metaAction";
import metaActionCareer from "containers/career/metaAction";
import initActionCollection from "containers/collectionLanding/initAction";
import initActionSpecific from "containers/collectionSpecific/initAction";
import initActionPLP from "containers/plp/initAction";
import initActionSearch from "containers/search/initAction";
import initActionCategoryLanding from "containers/categoryLanding/initAction";
import metaActionCategoryLanding from "containers/categoryLanding/metaAction";
import initActionAccount from "containers/myAccount/initAction";
import initActionGiftcard from "containers/giftcard/initAction";
import initActionShop from "containers/shopLocator/initAction";
// import initActionHome from "containers/home/initAction";
// import initActionDesignJournalBook from "containers/designJournalBook/initAction";
import initActionWishlist from "containers/wishlist/initAction";
import initActionBridal from "containers/bridal/initAction";
import initActionCheckout from "containers/checkout/initAction";
import initActionCart from "containers/cartPage/initAction";

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
    meta: metaActionCareer,
    exact: false
  },
  {
    path: ROUTES.WISHLIST,
    component: loadable(() => import("containers/wishlist")),
    action: initActionWishlist,
    exact: true
  },
  {
    path: ROUTES.CATEGORY,
    component: loadable(() => import("containers/categoryLanding")),
    action: initActionCategoryLanding,
    meta: metaActionCategoryLanding,
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
    path: ROUTES.SAFETYMEASURES,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
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
    action: initActionCheckout,
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
    path: ROUTES.CARTPAGE,
    component: loadable(() => import("containers/cartPage")),
    action: initActionCart,
    exact: true
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
  },
  {
    path: ROUTES.ABOUTUS,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.APPOINTMENTS,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.LOYALTYLANDING,
    component: loadable(() => import("containers/loyaltyLanding")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.ERROR,
    component: loadable(() => import("containers/error")),
    action: async () => null,
    exact: true
  },
  // {
  //   path: ROUTES.DESIGNJOURNALBOOK,
  //   component: loadable(() => import("containers/designJournalBook")),
  //   action: initActionDesignJournalBook,
  //   exact: false
  // }
  {
    path: ROUTES.CORPORATEGIFTING,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.GIFTINGLANDING,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.BRIDAL,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.BACKENDERROR,
    component: loadable(() => import("containers/BackendOrderError")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.PUSHPANJALI,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.MAINTENANCE,
    component: loadable(() => import("containers/maintenance")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.HOME,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.MUBARAK,
    component: loadable(() => import("containers/mubaarak")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.BRIDALPUBLIC,
    component: loadable(() => import("containers/bridal")),
    action: initActionBridal,
    exact: true
  },
  {
    path: ROUTES.WITHMAKER,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.WITHOUTMAKER,
    component: loadable(() => import("containers/withoutmaker")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.MICROSITE,
    component: loadable(() => import("containers/microsite")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.VIRTUAL,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.INSTORE,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.THANKYOU,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.EMAILVERIFICATION,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.SHOPPER,
    component: loadable(() => import("containers/ShopperForm")),
    action: async () => null,
    exact: true
  }
];

routes.forEach(route => {
  paths.push(route.path);
  routeMap[route.path] = route;
});

export { paths, routeMap, routes };
