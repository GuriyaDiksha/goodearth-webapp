export type QuantityItem = {
  currentvalue: string | number;
  onChange?: (event: React.MouseEvent | number) => void;
  minvalue: number;
  maxvalue: number;
  errormsg?: string;
};
