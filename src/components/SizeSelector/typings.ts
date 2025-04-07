import {
  ChildProductAttributes,
  PartialChildProductAttributes
} from "typings/product";

export type Props = {
  sizes: ChildProductAttributes[] | PartialChildProductAttributes[] | [];
  onChange: (selected: ChildProductAttributes) => void;
  selected?: number;
  sizeClassName?: string;
  isCorporatePDP?: boolean;
  containerClassName?: string;
  presentIn?: boolean;
  fillerproduct?: boolean;
};
