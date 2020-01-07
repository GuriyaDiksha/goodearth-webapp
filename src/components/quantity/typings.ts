export type QuantityItem = {
  currentvalue: number;
  onChange: (value: number) => void;
  minvalue: number;
  maxvalue: number;
  errormsg?: string;
};
