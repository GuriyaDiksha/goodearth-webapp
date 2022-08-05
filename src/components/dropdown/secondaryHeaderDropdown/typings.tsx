import { CategoryMenu } from "containers/collectionLanding/typings";

export type SecondaryHeaderDropdownMenuProps = {
  id: string;
  onChange: (value?: string, label?: string) => void;
  value: string;
  items: CategoryMenu[];
  className?: string;
};
