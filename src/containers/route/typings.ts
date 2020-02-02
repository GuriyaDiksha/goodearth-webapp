import { RouteObject, RouteParams } from "routes/typings";

export type Props = RouteObject & {
  params: RouteParams;
};
