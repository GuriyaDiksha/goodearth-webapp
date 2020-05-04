import { actionCreator } from "utils/actionCreator";
import { PageMetaResponse } from "services/meta/typings";

export const updatePageMeta = (meta: PageMetaResponse) =>
  actionCreator("UPDATE_PAGE_META", meta);

export const resetPageMeta = () => actionCreator("RESET_PAGE_META", {});
