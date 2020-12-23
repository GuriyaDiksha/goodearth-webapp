export type QuickviewProps = {
  id: number;
  productListId: number[];
  corporatePDP?: boolean;
  source?: string;
};

export type State = {
  sidebarSticky: boolean;
  detailsSticky: boolean;
  currentIndex: number;
};
