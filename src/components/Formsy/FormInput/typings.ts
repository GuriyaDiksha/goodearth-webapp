import React, { RefObject } from "react";

export type Props = {
  name: string;
  type?: string;
  value?: string | null;
  label?: string;
  error?: string | (string | JSX.Element)[];
  placeholder: string;
  border?: boolean;
  disable?: boolean;
  className?: string;
  id?: string;
  blur?: (event: React.FocusEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  isDrop?: boolean;
  isPaste?: boolean;
  inputClass?: string;
  disablePassword?: () => void;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  keyPress?: (event: React.KeyboardEvent) => void;
  keyDown?: (event: React.KeyboardEvent) => void;
  keyUp?: (event: React.KeyboardEvent) => void;
  min?: number | string;
  max?: number | string;
  inputRef?: RefObject<HTMLInputElement>;
  isPlaceholderVisible?: boolean;
  maxlength?: number;
  defaultClass?: string;
  onPaste?: (event: React.ClipboardEvent) => void;
  showLabel?: boolean;
  noErrOnPristine?: boolean;
};

export type State = {
  value: string;
  labelClass: boolean;
  placeholder: string;
};
