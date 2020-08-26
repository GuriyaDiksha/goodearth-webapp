import { ProductID } from "./id";
import { PriceRecord } from "./price";

export type WishlistItem = {
  id: number;
  quantity: number;
  dndSequence: number;
  size?: string;
  sequence: number;
  productId: ProductID;
  productName: string;
  productImage: string;
  productUrl: string;
  collection: string;
  price: PriceRecord;
  stockDetails: {
    productId: ProductID;
    stock: number;
    size: string;
    price: PriceRecord;
    discountedPrice: PriceRecord;
    sku: string;
  }[];
  discountedPrice: PriceRecord;
  badgeImage: string;
  discount: boolean;
  category: string[];
  gaVariant: string;
  badgeType?: string;
};

export type WishListGridItem = WishlistItem & {
  key: number;
  sort: number;
};
