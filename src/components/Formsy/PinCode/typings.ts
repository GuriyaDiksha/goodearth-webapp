export type PinCodeData = {
  [x: string]: string;
};

export type Props = {
  changeState: (x: string) => void;
  code?: string;
  error?: string;
  blur?: (event: React.MouseEvent<HTMLInputElement>) => void;
  border?: boolean;
  id: string;
  className?: string;
  label?: string;
  disable?: boolean;
  placeholder: string;
  value: string;
  handleChange?: (event: React.ChangeEvent) => void;
};
