import { Store } from "redux";
import { RouteParams } from "src/routes/typings";
import { Location } from "history";
import { PageMetaRequest } from "services/meta/typings";
import { Currency } from "./currency";
import { History } from "history";

export type InitAction = (
  store: Store,
  params: RouteParams,
  location: Location,
  currency?: Currency,
  history?: History
) => void;

export type MetaAction = (location: Location) => Partial<PageMetaRequest>;
