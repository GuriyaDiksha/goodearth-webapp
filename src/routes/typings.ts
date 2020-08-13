import { InitAction, MetaAction } from "typings/actions";

export enum ROUTES {
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
  CAREER = "/careers/:slug1?/:slug2?",
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
  SAFETYMEASURES = "/customer-assistance/safety-measures"
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
