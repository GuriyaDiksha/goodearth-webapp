import { ProductImage } from "typings/image";

export type Props = {
  images: ProductImage[];
  className?: string;
  activeIndex?: number;
  onImageClick?: (index: number) => void;
};
