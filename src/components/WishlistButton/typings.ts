import { ProductID } from "typings/id";

export type Props = {
  id: ProductID;
  showText?: boolean;
  className?: string;
  mobile?: boolean;
  iconClassName?: string;
  basketLineId?: ProductID;
};
