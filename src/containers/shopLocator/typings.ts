export type ShopLocatorProps = {
  goback?: (section: string) => void;
  mobile: boolean;
  data: any[];
};

export type ShopDetailsProps = {
  mobile: boolean;
  data: any[];
  goback?: (section: string) => void;
};

export type ShopProps = {
  city: string;
  shopname: string;
};
