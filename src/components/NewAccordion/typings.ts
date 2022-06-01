import { ReactNode } from "react";

export type Section = {
  header: ReactNode;
  body: ReactNode;
  id: string;
};

export type Props = {
  sections: Section[];
  className: string;
  headerClassName: string;
  closedIconClassName?: string;
  openIconClassName?: string;
};
