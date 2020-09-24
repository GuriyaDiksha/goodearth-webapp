export type QuickviewProps = {
  id: number;
  productListId: number[];
  corporatePDP?: boolean;
};

export type State = {
  sidebarSticky: boolean;
  detailsSticky: boolean;
  currentIndex: number;
};
