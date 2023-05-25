import * as Actions from "actions/collection";
import { ActionType } from "typings/actionCreator";
import { CollectionProps } from "containers/collectionLanding/typings";
import {
  CollectionItem,
  CollectionTemplatesData
} from "components/collectionItem/typings";
import {
  CollectionSpecificProps,
  CollectionSpecificBannerProps
} from "containers/collectionSpecific/typings";

export type CollectionState = {
  data: CollectionProps;
  result: CollectionItem[];
  collectionSpecficdata: CollectionSpecificProps;
  collectionSpecficBanner: CollectionSpecificBannerProps;
  collectionIds: number[];
  tags: string[];
  filteredCollectionData: CollectionItem[];
  collectionMobileView: "list" | "grid";
  collectionTemplates: CollectionTemplatesData;
};

export type DeviceActions = ActionType<typeof Actions>;
