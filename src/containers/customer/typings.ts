export type AccountMenuItem = {
  label: string;
  href: string;
  title: string;
  currentCallBackComponent?: string;
  pageTitle?: string;
};

export type AccordionData = {
  content: string;
  heading: string;
  isAccordion: boolean;
};

export type Props = {
  setCurrentSection: () => void;
  mobile: boolean;
  fetchTerms: () => Promise<{
    link: string;
    content: string;
    pageTitle: string;
    accordionData: AccordionData[];
  }>;
};
export type State = {
  isActive: boolean;
  isActiveCN: boolean;
};
