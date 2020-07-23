import React from "react";
import { BridalDetailsType, BridalProfileData } from "./typings";
import { AddressData } from "components/Address/typings";

type BridalContextType = {
  addressType?: string;
  step: string;
  bridalId?: number;
  currentCallBackComponent?: string;
  isBridal?: boolean;
  bridalProfile?: BridalProfileData;
  // bridalItems: BridalItem[];
  data: BridalDetailsType;
  bridalAddress?: AddressData;
  setCurrentModule: (module: string) => void;
  setCurrentModuleData: (module: string, data: { [x: string]: string }) => void;
  setCurrentScreenValue: (value: string) => void;
  changeBridalAddress: (addressId: number) => void;
};
const initState: BridalContextType = {
  isBridal: true,
  currentCallBackComponent: "bridal",
  addressType: "SHIPPING",
  step: "create",
  data: {
    occasion: "",
    registrantName: "",
    registryName: "",
    coRegistrantName: "",
    userAddress: undefined,
    eventDate: ""
  },
  // bridalItems: [],
  // bridalAddress: {},
  // bridalProfile: ,
  changeBridalAddress: (addressId: number) => null,
  setCurrentModule: (module: string) => null,
  setCurrentModuleData: (module: string, data: { [x: string]: string }) => null,
  setCurrentScreenValue: (value: string) => null
};
const BridalContext = React.createContext(initState);
export default BridalContext;
