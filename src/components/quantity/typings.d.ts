import { ProductID } from "typings/id";

export type QuantityItem = {
  id: ProductID;
  currentValue: number;
  onChange: (value: number) => void;
  onUpdate?: (value: number) => Promise<void>;
  minValue: number;
  maxValue: number;
  errorMsg?: string;
  disabled?: boolean;
  class?: string;
  className?: string;
  source: string;
  inputClass?: string;
};

export interface State {
  showError: boolean;
  errorMsg: string;
}
