import { ChildProductAttributes } from "typings/product";

export type Props = {
  sizes: ChildProductAttributes[];
  onChange: (selected: ChildProductAttributes) => void;
  selected?: number;
  sizeClassName?: string;
  isCorporatePDP?: boolean;
};
