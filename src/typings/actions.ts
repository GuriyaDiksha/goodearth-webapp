import { Dispatch } from "redux";
import { RouteParams } from "src/routes/typings";
import { Location } from "history";

export type InitAction = (
  dispatch: Dispatch,
  params: RouteParams,
  location: Location
) => void;
