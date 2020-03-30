import { ProductID } from "./id";

export type WishlistItem = {
  id: number;
  quantity: number;
  dndSequence: number;
  size?: string;
  sequence: number;
  productId: ProductID;
};
