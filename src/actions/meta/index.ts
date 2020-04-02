import { actionCreator } from "utils/actionCreator";
import { MetaResponse } from "services/meta/typings";

export const updateMeta = (meta: MetaResponse) =>
  actionCreator("UPDATE_META", meta);
