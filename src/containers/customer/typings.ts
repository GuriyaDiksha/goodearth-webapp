export type AccountMenuItem = {
  label: string;
  href: string;
  component: React.ComponentType<any>;
  title: string;
  currentCallBackComponent?: string;
  loggedInOnly: boolean;
};

export type Props = {
  setCurrentSection: () => void;
  mobile: boolean;
};
export type State = {
  isActive: boolean;
  isActiveCN: boolean;
};
