// modules
import loadable from "@loadable/component";
import { RouteConfig, ROUTES, RouteMap } from "./typings";
import initAction from "containers/pdp/initAction";
import metaAction from "containers/pdp/metaAction";
import metaActionPlp from "containers/plp/metaAction";
import metaActionCareer from "containers/careerDetail/metaAction";
// import initActionCollection from "containers/collectionLanding/initAction";
// import metaActionCollectionLanding from "containers/collectionLanding/metaAction";
import metaActionCollectionSpecific from "containers/collectionSpecific/metaAction";
import initActionSpecific from "containers/collectionSpecific/initAction";
import initActionPLP from "containers/plp/initAction";
import initActionSearch from "containers/search/initAction";
import initActionCategoryLanding from "containers/categoryLanding/initAction";
import metaActionCategoryLanding from "containers/categoryLanding/metaAction";
import customerMetaAction from "containers/customer/metaAction";
import initActionAccount from "containers/myAccount/initAction";
import initActionGiftcard from "containers/giftcard/initAction";
import initActionShop from "containers/shopLocator/initAction";
// import initActionHome from "containers/home/initAction";
// import initActionDesignJournalBook from "containers/designJournalBook/initAction";
// import initActionWishlist from "containers/wishlist/initAction";
import initActionBridal from "containers/bridal/initAction";
import initActionCheckout from "containers/checkout/initAction";
import initActionCart from "containers/cartPage/initAction";
import initActionCareer from "containers/careerNew/initAction";
import initActionRegistery from "containers/giftRegistery/initAction";
// import initActionCatalogue from "containers/corparateCatalouge/initAction";

const paths: string[] = [];
const routeMap: RouteMap = {};

const routes: RouteConfig = [
  {
    path: ROUTES.CollectionLanding,
    component: loadable(() => import("containers/collectionLanding")),
    action: async () => null,
    // meta: metaActionCollectionLanding,
    exact: true
  },
  {
    path: ROUTES.CollectionSpecific,
    component: loadable(() => import("containers/collectionSpecific")),
    action: initActionSpecific,
    meta: metaActionCollectionSpecific,
    exact: true
  },
  {
    path: ROUTES.PLP,
    component: loadable(() => import("containers/plp")),
    action: initActionPLP,
    meta: metaActionPlp,
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
    path: ROUTES.CAREERDETAIL,
    component: loadable(() => import("containers/careerDetail")),
    action: async () => null,
    meta: metaActionCareer,
    exact: true
  },
  {
    path: ROUTES.CAREER,
    component: loadable(() => import("containers/careerNew")),
    action: initActionCareer,
    exact: false
  },
  {
    path: ROUTES.REGISTERY,
    component: loadable(() => import("containers/giftRegistery")),
    action: initActionRegistery,
    exact: false
  },
  {
    path: ROUTES.WISHLIST,
    component: loadable(() => import("containers/wishlist/WishlistDetailPage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.SHAREDWISHLIST,
    component: loadable(() => import("containers/wishlist/WishlistDetailPage")),
    action: async () => null,
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
    component: loadable(() => import("containers/newGiftcard")), // GiftCard,
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
    meta: customerMetaAction,
    exact: false
  },
  {
    path: ROUTES.CHECKOUT,
    component: loadable(() => import("containers/checkout")),
    action: initActionCheckout,
    exact: true
  },
  {
    path: ROUTES.GCCHECKOUT,
    component: loadable(() => import("containers/checkout")),
    action: initActionCheckout,
    exact: true
  },
  {
    path: ROUTES.SHOP,
    component: loadable(() => import("containers/newShopLocator")),
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
  {
    path: ROUTES.ERR404,
    component: loadable(() => import("containers/error")),
    action: async () => null,
    exact: true
  },
  // {
  //   path: ROUTES.DESIGNJOURNALBOOK,
  //   component: loadable(() => import("containers/designJournalBook")),
  //   action: initActionDesignJournalBook,
  //   exact: false
  // },
  {
    path: ROUTES.BACKENDERROR,
    component: loadable(() => import("containers/BackendOrderError")),
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
    path: ROUTES.SHOPPER,
    component: loadable(() => import("containers/ShopperForm")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.AUTH,
    component: loadable(() => import("containers/base/Auth")),
    action: async () => null,
    exact: false
  },
  {
    path: ROUTES.NEWSLETTERS,
    component: loadable(() => import("containers/Newsletters")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.ANNUALSALE,
    component: loadable(() => import("containers/AnnualSale")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.SIGNUPS25,
    component: loadable(() => import("containers/SignUps25")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.INTERNATIONALSALE,
    component: loadable(() => import("containers/InternationalSale")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.SITEMAP,
    component: loadable(() => import("containers/Sitemap")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.IFRAME,
    component: loadable(() => import("containers/iframepage")),
    action: async () => null,
    exact: true
  },
  {
    path: ROUTES.CORPORATECATALOGUE,
    component: loadable(() => import("containers/corporateCatalouge")),
    action: async () => null,
    exact: true
  }
];

const makerRoutes = [
  ROUTES.SAFETYMEASURES,
  ROUTES.ABOUTUS,
  ROUTES.APPOINTMENTS,
  ROUTES.CORPORATEGIFTING,
  ROUTES.GIFTINGLANDING,
  // ROUTES.BRIDAL,
  ROUTES.REGISTERY,
  ROUTES.PUSHPANJALI,
  ROUTES.HOME,
  ROUTES.ERROR404,
  // ROUTES.WITHMAKER,
  ROUTES.VIRTUAL,
  ROUTES.INSTORE,
  ROUTES.THANKYOU,
  ROUTES.MUMTAZ,
  // ROUTES.GCEMAIL,
  ROUTES.WORKSHOPS,
  ROUTES.DEVIKANARAIN,
  ROUTES.MARUTSIKHA,
  ROUTES.NEHAKAPUR,
  ROUTES.SABINASINGH,
  ROUTES.DEEPSHIKHA,
  ROUTES.EESHAAN,
  ROUTES.GUEST,
  ROUTES.TASTINGROOM,
  ROUTES.MIRAGE,
  ROUTES.MIRAGESHOP,
  ROUTES.MAGHREB,
  ROUTES.TANGIER,
  ROUTES.TANGIERBYRICHARDHAMILTON,
  ROUTES.MATERIALCULTURE,
  ROUTES.VINITACHAITANYA,
  ROUTES.VASUDHARAI,
  ROUTES.BOSPORUSMETALDECOR,
  ROUTES.TELLINGSTORIES,
  ROUTES.VIRTUALSHOPPINGSALON,
  ROUTES.GUIDETOLIGHTING,
  ROUTES.INNERSPACE,
  ROUTES.LILANURPARFUMS,
  ROUTES.PEHCHAANNAQASHI,
  ROUTES.MEMORYKEEPERS,
  ROUTES.MEMORYKEEPERSTWO,
  ROUTES.HARVESTATTHETABLE,
  ROUTES.INNERSPACEKONKONASENSHARMA,
  ROUTES.INNERSPACEKONABHANARAINLAMBAH,
  ROUTES.INNERSPACESUNHILSIPPY,
  // ROUTES.CORPARATECATALOGUE,
  ROUTES.UAESHOP
];

const makerSmartnav = [
  ROUTES.MAKERTEST,
  ROUTES.ANINDIANSUMMER,
  ROUTES.ARTOFENTERTAINING
];

makerRoutes.forEach(route => {
  routes.push({
    path: route,
    component: loadable(() => import("containers/makerpage")),
    action: async () => null,
    exact: true
  });
});

makerSmartnav.forEach(route => {
  routes.push({
    path: route,
    component: loadable(() => import("containers/smartNav")),
    action: async () => null,
    exact: true
  });
});

routes.forEach(route => {
  paths.push(route.path);
  routeMap[route.path] = route;
});

export { paths, routeMap, routes };
