export interface CollectionFilter {
  activeFilterHandler: (data: string) => void;
  tags: string[];
  activeFilterList: string[];
}
