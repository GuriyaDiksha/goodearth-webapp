import { EventHandler, SyntheticEvent } from "react";

export type Props = {
  aspectRatio?: string;
  className?: string;
  containerClassName?: string;
  isVisible?: boolean;
  src: string;
  alt?: string;
  onClick?: () => void;
  onLoad?: EventHandler<SyntheticEvent<HTMLImageElement>>;
  onError?: EventHandler<SyntheticEvent<HTMLImageElement>>;
  shouldUpdateAspectRatio?: boolean;
};

export type State = {
  isVisible: boolean;
  style: any;
};
