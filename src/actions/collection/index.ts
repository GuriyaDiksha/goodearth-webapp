import { actionCreator } from "utils/actionCreator";
import { CollectionItem } from "components/collectionItem/typings";
import { CollectionProps } from "containers/collectionLanding/typings";
import {
  CollectionSpecificProps,
  CollectionSpecificBannerProps
} from "containers/collectionSpecific/typings";

export const updateCollectionFilter = (data: CollectionProps) =>
  actionCreator("UPDATE_COLLECTION_FILTER", data);

export const updateCollectionData = (data: CollectionItem[]) =>
  actionCreator("UPDATE_COLLECTION_DATA", data);

export const updateCollectionSpecificData = (data: CollectionSpecificProps) =>
  actionCreator("UPDATE_COLLECTION_SPECIFIC_DATA", data);

export const updateCollectionSpecificBanner = (
  data: CollectionSpecificBannerProps
) => actionCreator("UPDATE_COLLECTION_BANNER_DATA", data);
