import { ProductID } from "typings/id";

export type QuantityItem = {
  id?: ProductID;
  currentValue: number;
  onChange: (value: number) => void;
  minValue: number;
  maxValue: number;
  errorMsg?: string;
  disabled?: boolean;
  class?: string;
  className?: string;
};

export interface State {
  showError: boolean;
}
