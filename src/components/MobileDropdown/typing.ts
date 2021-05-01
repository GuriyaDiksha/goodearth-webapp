export type MobileDropdownMenuProps = {
  className?: string;
  list: any;
  value?: string;
  display?: JSX.Element | string;
  open?: boolean;
  showCaret?: boolean;
  onChange: (data: any, label?: string) => void;
};
