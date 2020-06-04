import { Breadcrumb } from "typings/navigation";

export type Props = {
  levels: Breadcrumb[];
  separator?: string;
  className?: string;
  isViewAll: boolean;
};
