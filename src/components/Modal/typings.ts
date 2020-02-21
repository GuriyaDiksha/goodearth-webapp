import { ReactNode } from "react";

export type Props<T extends HTMLElement> = {
  bodyClassName?: "string";
  children?: ReactNode;
  parentNode: T;
  className?: string;
};

export type ModalContext = React.Context<{
  closeModal: () => void;
}>;
