import { ProductSliderImage } from "typings/image";

export type Props = {
  images: ProductSliderImage[];
  className?: string;
  activeIndex?: number;
  onImageClick?: (index: number) => void;
};
