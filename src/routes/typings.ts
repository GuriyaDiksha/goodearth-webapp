import { InitAction } from "typings/actions";

export enum ROUTES {
  HOME = "/",
  PDP = "/product/:slug",
  CollectionLanding = "/allcollection/living_26/",
  CollectionSpecific = "/collection/:slug"
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
  exact?: boolean;
};
