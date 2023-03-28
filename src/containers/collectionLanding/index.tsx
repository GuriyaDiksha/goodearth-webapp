import React, { useEffect, useState } from "react";
import CollectionFilter from "components/Collection/CollectionFilter";

const CollectionLanding = () => {
  const [activeFilterList, setActiveFilterList] = useState<string[]>([]);

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
  console.log(activeFilterList);

  return (
    <div>
      <CollectionFilter ActiveFilterHandler={ActiveFilterHandler} />
    </div>
  );
};

export default CollectionLanding;
