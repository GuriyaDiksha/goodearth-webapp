import React from "react";
import { ModalContext } from "./typings";

export const Context: ModalContext = React.createContext({
  closeModal: () => {
    console.log("");
  }
});
