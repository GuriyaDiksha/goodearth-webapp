import { AddressData } from "components/Address/typings";
import { Currency } from "typings/currency";
import { ProductID } from "typings/id";
import { PriceRecord } from "typings/price";

export type BridalDetailsType = {
  occasion: string;
  occassion_choice: string;
  coRegistrantName: string;
  eventDate: string;
  registrantName: string;
  registryName: string;
  userAddress: AddressData | undefined;
};

export type Props = {
  openBridalPop: () => void;
  errorMessage: string;
  // currentCallBackComponent?: string;
  // isBridal?: boolean;
  // data: BridalDetailsType;
  // setCurrentModule: (module: string) => void;
  // setCurrentModuleData: (module: string, data: {[x: string] : string}) => void;
};

export type BridalProfileData = {
  bridalId: number;
  occasion: string;
  occassion_choice: string;
  eventDate: string;
  key: string;
  shareLink: string;
  registrantName: string;
  coRegistrantName: string;
  registryName: string;
  currency: Currency;
  userId: number;
  userAddressId: number;
};

export type childAttributes = {
  id: number;
  sku: string;
  priceRecords: PriceRecord;
  discountedPriceRecords: PriceRecord;
  stock: number;
  showStockThreshold: boolean;
  othersBasketCount: number;
  size: string;
  isBridalProduct: boolean;
  color: string;
};

export type BridalItemData = {
  id: number;
  productId: ProductID;
  size: string;
  qtyRequested: number;
  qtyBought: number;
  qtyRemaining: number;
  productName: string;
  productImage: string;
  productUrl: string;
  collection: string | null;
  color: string[] | null;
  price: PriceRecord;
  discountedPrice: PriceRecord;
  badgeImage: string;
  badgeType?: string;
  discount: boolean;
  stock: number;
  sku: string;
  productDeliveryDate: string;
  productAvailable: boolean;
  childAttributes: childAttributes[];
};

export type BridalPublicProfileData = {
  bridalId: number;
  occasion: string;
  occassion_choice: string;
  eventDate: string;
  registrantName: string;
  coRegistrantName: string;
  registryName: string;
  currency: Currency;
  items: BridalItemData[];
  message?: string;
};
