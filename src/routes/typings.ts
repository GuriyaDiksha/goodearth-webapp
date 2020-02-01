import { ReactNode } from "react";
import { Dispatch } from "redux";

export enum ROUTES {
  HOME = "/",
  PDP = "/product/:id"
}

export type RouteConfig = RouteObject[];

export type RouteMap = {
  [x in ROUTES]?: RouteObject;
};

export type RouteParams = {
  [x: string]: string;
};

export type RouteObject = {
  path: ROUTES;
  component: ReactNode;
  action: InitAction;
};

export type InitAction = (dispatch: Dispatch, params: RouteParams) => void;
