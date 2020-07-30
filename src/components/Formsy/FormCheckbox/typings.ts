import { RefObject } from "react";

export type Props = {
  inputRef?: RefObject<HTMLInputElement>;
  id: string;
  name: string;
  disable: boolean;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: (string | JSX.Element)[];
  value: boolean;
};
