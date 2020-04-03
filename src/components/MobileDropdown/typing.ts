export type MobileDropdownMenuProps = {
  className?: string;
  children: any;
  value?: string;
  display?: JSX.Element | string;
  open?: boolean;
  showCaret?: boolean;
  onChange: (data: any) => void;
};
