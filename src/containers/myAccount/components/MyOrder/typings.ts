export type MyOrderState = {
  hasShoppedOnlineitems: boolean;
  hasShoopedAtStore: boolean;
  hasShopped: boolean;
  isLoading: boolean;
};

export type OrdersProps = {
  hasShopped: (x: boolean) => void;
  isLoading: (x: boolean) => void;
};

export type MyOrdersResponse = {
  count: number;
  next: null;
  previous: null;
  results: [];
};
