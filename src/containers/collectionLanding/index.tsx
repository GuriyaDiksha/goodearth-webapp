import React, { useState } from "react";
import CollectionFilter from "components/Collection/CollectionFilter";
import CollectionItem from "components/Collection/CollectionItem";
import styles from "./styles.scss";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const CollectionLanding = () => {
  const [activeFilterList, setActiveFilterList] = useState<string[]>([]);
  const {
    collection: { result, data },
    router: { location },
    currency,
    device,
    info: { showTimer }
  } = useSelector((state: AppState) => state);

  const collection = location.pathname.split("/").pop();
  const collectionName = collection ? collection.split("_")[0] : "";
  const isLivingpage = location.pathname.includes("living");

  // Filter Tag Functionality
  const ActiveFilterHandler = (ele: string) => {
    const isExist = activeFilterList.some(element => {
      if (element === ele) {
        return true;
      }
      return false;
    });
    if (!isExist) {
      setActiveFilterList(activeFilterList => [...activeFilterList, ele]);
    }
  };

  return (
    <div>
      <CollectionFilter ActiveFilterHandler={ActiveFilterHandler} />

      <div className={styles.itemList}>
        {result?.map((collectionData, i) => (
          <CollectionItem key={i} collectionData={collectionData} />
        ))}
      </div>
    </div>
  );
};

export default CollectionLanding;
