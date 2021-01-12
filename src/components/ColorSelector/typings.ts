import { GroupedProductItem } from "typings/product";

export type Props = {
  products: GroupedProductItem[];
  onClick: () => void;
};
