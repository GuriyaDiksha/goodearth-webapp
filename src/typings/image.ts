import { ProductID, ImageID } from "./id";

export interface ProductSliderImage {
  id: ImageID;
  productImage: string;
  caption?: string;
  displayOrder: number;
  dateCreated: Date;
  social: boolean;
  product: ProductID;
}

export interface ProductImage extends ProductSliderImage {
  badgeImage?: string;
  badgeImagePDP?: string;
}
