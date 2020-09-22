import { PriceRecord } from "../../typings/price";
import { Currency } from "../../typings/currency";

export type DesignJournalProduct = {
  name: string;
  price: PriceRecord;
  currency: Currency;
  image: string;
  sku: string;
  url: string;
};

export type DesignJournalBookData = {
  mainProduct: DesignJournalProduct;
  imageData: {
    sliderImage: string;
    associatedProducts: DesignJournalProduct[];
  }[];
};
