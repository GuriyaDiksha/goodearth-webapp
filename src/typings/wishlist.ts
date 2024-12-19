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
    showStockThreshold: boolean;
  }[];
  discountedPrice: PriceRecord;
  salesBadgeImage: string;
  discount: boolean;
  category: string[];
  gaVariant: string;
  badgeType?: string;
  badge_text?: string;
};

export type WishlistData = WishlistItem & {
  id: number;
  name: string;
  products: WishlistItem[];
  sharable_link: string;
};

export type WishListGridItem = WishlistData & {
  key: number;
  sort: number;
};

export type createSharedLinkResponse = {
  is_success: boolean;
  message: string;
  secret_key: string;
  wishlist_link: string;
};
