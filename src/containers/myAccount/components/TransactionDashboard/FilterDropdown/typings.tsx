import { CategoryMenu } from "containers/collectionLanding/typings";

export type SecondaryHeaderDropdownMenuProps = {
  id: string;
  onChange: (value: string) => void;
  value: string;
  items: CategoryMenu[];
  className?: string;
  isCheckBox: boolean;
  handleCheckbox: (val: string) => void;
  setOldFilterState: () => void;
  cancelFilter: () => void;
};
