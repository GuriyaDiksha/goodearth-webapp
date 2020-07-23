import { AddressData } from "components/Address/typings";
import { Currency } from "typings/currency";
import { ProductID } from "typings/id";
import { PriceRecord } from "typings/price";

export type BridalDetailsType = {
  occasion: string;
  coRegistrantName: string;
  eventDate: string;
  registrantName: string;
  registryName: string;
  userAddress: AddressData | undefined;
};

export type Props = {
  createRegistry: () => void;
  // currentCallBackComponent?: string;
  // isBridal?: boolean;
  // data: BridalDetailsType;
  // setCurrentModule: (module: string) => void;
  // setCurrentModuleData: (module: string, data: {[x: string] : string}) => void;
};

export type BridalProfileData = {
  bridalId: number;
  occasion: string;
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

export type BridalItem = {
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
  discount: boolean;
  stock: number;
  sku: string;
};
