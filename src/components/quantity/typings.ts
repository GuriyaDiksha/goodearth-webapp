export type QuantityItem = {
  currentvalue: string | number;
  onChange?: (event: React.MouseEvent) => void;
  minvalue: number;
  maxvalue: number;
  errormsg?: string;
};
