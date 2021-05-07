export type MobileDropdownMenuProps = {
  className?: string;
  list: any;
  value?: string;
  display?: JSX.Element | string;
  open?: boolean;
  showCaret?: boolean;
  onStateChange: (state: boolean) => void;
  onChange: (data: any, label: string) => void;
  filterCount?: number;
};
