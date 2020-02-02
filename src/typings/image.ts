import { ImageID } from "./id";

export interface ProductSliderImage {
  id: ImageID;
  productImage: string;
  caption?: string;
  displayOrder: number;
  social: boolean;
}

export interface ProductImage extends ProductSliderImage {
  badgeImage?: string;
  badgeImagePDP?: string;
}
