import { AddressData } from "components/Address/typings";
import { createContext } from "react";

export const CheckoutAddressContext = createContext({
  onSelectAddress: (address?: AddressData) => {
    return;
  }
});
