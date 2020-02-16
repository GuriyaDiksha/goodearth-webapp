import { ReactNode } from "react";

export type Section = {
  header: ReactNode;
  body: ReactNode;
  id: string;
};

export type Props = {
  sections: Section[];
  defaultOpen?: string;
  openIconClass?: string;
  closedIconClass?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
};
