import { Product, PartialProductItem } from "typings/product";
import { ProductID } from "typings/id";

export type Props = {
  id: ProductID;
  url: string;
  data: Product | PartialProductItem;
};
