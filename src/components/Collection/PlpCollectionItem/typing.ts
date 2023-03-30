export type PlpCollectionItemType = {
  name: string;
  sliderImages?: string[] | undefined;
  url?: string;
  tags: string[];
};
export interface PlpCollectionItems {
  key: number;
  collectionData: PlpCollectionItemType;
}
