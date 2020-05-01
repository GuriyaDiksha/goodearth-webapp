import { ReactNode } from "react";

export type Props = {
  bodyClassName?: "string";
  children?: ReactNode;
  className?: string;
  fullscreen?: boolean;
  openModal?: boolean;
};

export type ModalContext = React.Context<{
  closeModal: () => void;
}>;
