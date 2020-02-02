import { Dispatch } from "redux";
import { RouteParams } from "src/routes/typings";

export type InitAction = (dispatch: Dispatch, params: RouteParams) => void;
