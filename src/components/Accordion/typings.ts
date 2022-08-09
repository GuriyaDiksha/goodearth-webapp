import { ReactNode } from "react";

export type Section = {
  header: ReactNode;
  body: ReactNode;
  id: string;
};

export type Props = {
  sections: Section[];
  defaultOpen?: string;
  className: string;
  headerClassName: string;
  closedIconClassName?: string;
  openIconClassName?: string;
  bodyClassName?: string;
  sectionClassName?: string;
  uniqueKey?: string;
};
