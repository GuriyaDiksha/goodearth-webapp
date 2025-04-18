import { Product } from "typings/product";
import { Currency } from "typings/currency";
import { ProductID } from "typings/id";

export type Props = {
  data: Product;
  currency: Currency;
  closeModal?: () => void;
  mobile: boolean;
  tablet: boolean;
  wishlist: ProductID[];
  isQuickview?: boolean;
  changeModalState?: any;
  updateComponentModal: (
    component: string,
    props: any,
    fullScreen?: boolean,
    bodyClass?: string,
    classname?: string
  ) => void;
  corporatePDP: boolean;
  source?: string;
  showAddToBagMobile?: boolean;
  toggelHeader?: (value: boolean) => void;
  loading: boolean;
  setPDPButton?: (button: JSX.Element) => void;
  badgeMessage?: string;
};
