export type MyOrderState = {
  hasShoppedOnlineitems: boolean;
  hasShoopedAtStore: boolean;
  hasShopped: boolean;
  isLoading: boolean;
};

export type OrdersProps = {
  orderType: "online" | "inShop";
  hasShopped: (x: boolean) => void;
  isLoading: (x: boolean) => void;
  isDataAvaliable: (x: boolean) => void;
  email?: string;
};

export type ShopProps = {
  data: any;
  closeDetails: (index: number, orderNum?: string) => void;
  hasShopped: (x: boolean) => void;
  isLoading: (x: boolean) => void;
  isDataAvaliable: (x: boolean) => void;
};

export type MyOrdersResponse = {
  count: number;
  next: null;
  previous: null;
  results: [];
};
