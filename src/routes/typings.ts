import { InitAction, MetaAction } from "typings/actions";

export const enum ROUTES {
  HOME = "/",
  CollectionLanding = "/allcollection/:level1/:id",
  CollectionSpecific = "/collection/:slug",
  PDP = "/catalogue/:slug",
  PLP = "/catalogue/category/",
  CATEGORY = "/category_landing/:slug",
  FB = "/account/facebook/login/?next=/",
  GOOGLE = "/account/google/login/?next=/",
  SEARCH = "/search",
  ACCOUNT = "/account",
  CAREERDETAIL = "/careers-detail/:jobId",
  CAREER = "/careers",
  WISHLIST = "/wishlist",
  GIFTCARD = "/giftcard",
  ResetPassword = "/password-reset/confirm/:uid/:token",
  STATIC = "/customer-assistance/",
  CHECKOUT = "/order/checkout/",
  SHOP = "/Cafe-Shop/:city/:shopname?",
  ORDERCONFIRMATION = "/order/orderconfirmation/:oid",
  DESIGNJOURNAL = "/designjournal",
  DESIGNJOURNALBOOK = "/designjournalbook/",
  CARTPAGE = "/cart/",
  PressStories = "/press-stories",
  ABOUTUS = "/about-us",
  APPOINTMENTS = "/brand",
  SAFETYMEASURES = "/customer-assistance/safety-measures",
  CORPORATEGIFTING = "/corporate-gifts-catalogue",
  GIFTINGLANDING = "/gifting",
  BRIDAL = "/the-good-earth-registry",
  LOYALTYLANDING = "/cerise",
  ERROR = "/error-page",
  BACKENDERROR = "/backend-order-error",
  PUSHPANJALI = "/puspanjali-festive-2020",
  MAINTENANCE = "/maintenance",
  BRIDALPUBLIC = "/bridal/:id",
  MUBARAK = "/mubaarak-hour-notification",
  WITHMAKER = "/withmaker",
  WITHOUTMAKER = "/withoutmaker",
  MICROSITE = "/microsite/:id?",
  VIRTUAL = "/virtualappointment",
  SHOPPER = "/personal-shopper-form",
  INSTORE = "/instoreservices",
  THANKYOU = "/thankyou",
  MUMTAZ = "/mumtaz-virtual-appointment",
  GCEMAIL = "/send-giftcard",
  AUTH = "/auth",
  HFH = "/summer-lovin-reminders",
  SITEMAP = "/sitemap"
}

export type RouteConfig = RouteObject[];

export type RouteMap = {
  [x in ROUTES]?: RouteObject;
};

export type RouteParams = {
  [x: string]: string;
  location?: any;
};

export type RouteObject = {
  path: ROUTES;
  component: React.ComponentType<any>;
  action: InitAction;
  meta?: MetaAction;
  exact?: boolean;
};
