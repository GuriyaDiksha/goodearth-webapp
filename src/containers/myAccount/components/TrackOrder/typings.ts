export type TrackOrderProps = {
  setCurrentSection: () => void;
};
export type State = {
  showerror: string;
  updateSubmit: boolean;
  orderData: any;
  trackingData: any;
  showTracking: boolean;
  orderNumber: string;
  myemail: string;
};

export type OrdersProps = {
  trackingData: any;
  orderData: any;
  hasShopped?: (x: boolean) => void;
  isLoading?: (x: boolean) => void;
  isDataAvaliable?: (x: boolean) => void;
  mobile?: boolean;
};
