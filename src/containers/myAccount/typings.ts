export type AccountMenuItem = {
  label: string;
  href: string;
  component: React.ComponentType<any>;
  title: string;
  currentCallBackComponent?: string;
  loggedInOnly: boolean;
};
