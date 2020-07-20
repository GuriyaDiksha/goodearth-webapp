import { AddressData } from "components/Address/typings";

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
  currency: string;
  userId: number;
  userAddressId: number;
};
