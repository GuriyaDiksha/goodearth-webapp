import { ProductImage } from "typings/image";

export type Props = {
  images: ProductImage[];
  startIndex: number;
  mobile?: boolean;
  changeModalState?: any;
  alt: string;
};
