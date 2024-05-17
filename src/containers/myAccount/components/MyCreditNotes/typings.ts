export type CreditNoteResponse = {
  count: number;
  next: null;
  previous: null;
  results: CreditNote[];
};

export type CreditNote = {
  date_created: string;
  entry_code: string;
  remaining_amount: number;
  amount: number;
  applied_amount: number;
  expiring_date: string;
  is_expired: boolean;
  type?: string;
  message?: string;
};

export type HeaderData = Array<{
  key: string;
  title: string;
  sortIcon: boolean;
  isPrice: boolean;
}>;

export type SortBy = "date_created" | "expiring_date";

export type SortType = "asc" | "desc";
