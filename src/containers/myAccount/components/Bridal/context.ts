import React from "react";
import { BridalDetailsType } from "./typings";

type BridalContextType = {
  addressType?: string;
  case: string;
  currentCallBackComponent?: string;
  isBridal?: boolean;
  data: BridalDetailsType;
  setCurrentModule: (module: string) => void;
  setCurrentModuleData: (module: string, data: { [x: string]: string }) => void;
};
const initState: BridalContextType = {
  isBridal: true,
  currentCallBackComponent: "bridal",
  addressType: "SHIPPING",
  case: "create",
  data: {
    occasion: "",
    registrantName: "",
    registryName: "",
    coRegistrantName: "",
    userAddress: undefined,
    eventDate: ""
  },
  setCurrentModule: (module: string) => null,
  setCurrentModuleData: (module: string, data: { [x: string]: string }) => null
};
const BridalContext = React.createContext(initState);
export default BridalContext;
