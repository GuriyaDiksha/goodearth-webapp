export type AccountMenuItem = {
  label: string;
  href: string;
  component: React.ComponentType<any>;
  title: string;
  currentCallBackComponent?: string;
  loggedInOnly: boolean;
  pageTitle?: string;
};

export type Props = {
  setCurrentSection: () => void;
  mobile: boolean;
  fetchTerms: () => Promise<{ link: string; content: string }>;
};
export type State = {
  isActive: boolean;
  isActiveCN: boolean;
};
