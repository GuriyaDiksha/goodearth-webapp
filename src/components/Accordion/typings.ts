import { ReactNode } from "react";

export type Section = {
  header: ReactNode;
  body: ReactNode;
  id: string;
  alwaysOpen?: boolean;
};

export type Props = {
  sections: Section[];
  defaultOpen?: string;
  className: string;
  headerClassName?: string;
  openHeaderClassName?: string;
  closedIconClassName?: string;
  openIconClassName?: string;
  mainBodyClassName?: string;
  mainBodyOpenClassName?: string;
  bodyClassName?: string;
  sectionClassName?: string;
  uniqueKey?: string;
};
