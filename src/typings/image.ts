import { ImageID } from "./id";

export interface ProductImage {
  badgeImagePdp: string | undefined;
  id: ImageID;
  productImage: string;
  caption?: string;
  displayOrder: number;
  social: boolean;
  badgeImage?: string;
  badgeImagePDP?: string;
}
