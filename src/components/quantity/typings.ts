export type QuantityItem = {
  currentValue: number;
  onChange: (value: number) => void;
  minValue: number;
  maxValue: number;
  errorMsg?: string;
};
