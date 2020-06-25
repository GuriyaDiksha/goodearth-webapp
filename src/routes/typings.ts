import { InitAction, MetaAction } from "typings/actions";

export enum ROUTES {
  HOME = "/",
  CollectionLanding = "/allcollection/living_26/",
  CollectionSpecific = "/collection/:slug",
  PDP = "/catalogue/:slug",
  PLP = "/catalogue/category/",
  CATEGORY = "/category_landing/:slug",
  FB = "/account/facebook/login/?next=/",
  GOOGLE = "/account/google/login/?next=/",
  SEARCH = "/search",
  ACCOUNT = "/account",
  CAREER = "/careers"
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
