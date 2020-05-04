import { Dispatch } from "redux";
import { RouteParams } from "src/routes/typings";
import { Location } from "history";
import { PageMetaRequest } from "services/meta/typings";

export type InitAction = (
  dispatch: Dispatch,
  params: RouteParams,
  location: Location
) => void;

export type MetaAction = (location: Location) => Partial<PageMetaRequest>;
