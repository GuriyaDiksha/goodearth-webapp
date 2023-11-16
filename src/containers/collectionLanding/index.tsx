import React, { useEffect, useState } from "react";
import CollectionFilter from "components/Collection/CollectionFilter";
import CollectionItem from "components/Collection/CollectionItem";
import styles from "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { CollectionItemType } from "components/Collection/CollectionItem/typing";
import { useHistory, useLocation, useParams } from "react-router";
import CollectionService from "services/collection";
import {
  updateCollectionData,
  updateFilteredCollectionData,
  updateTagsData
} from "actions/collection";
// import { replace } from "lodash";

const CollectionLanding = () => {
  const [activeFilterList, setActiveFilterList] = useState<string[]>([
    "All Collections"
  ]);
  const [scrollView, setScrollView] = useState(false);
  const [filteredData, setFilteredData] = useState<CollectionItemType[]>([]);
  const [load, setLoad] = useState(true);
  const {
    collection: { result, tags },
    router: { location },
    currency
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const history = useHistory();

  const vars: { tags?: string } = {};
  const re = /[?&]+([^=&]+)=([^]*)/gi;
  let match;
  while ((match = re.exec(search))) {
    vars[match[1]] = match[2];
  }

  const multipleExist = (data: string[], filter: string[]) => {
    return filter.some(value => {
      return data?.includes(value);
    });
  };

  const fetchData = async () => {
    if (id) {
      const [tags, collectionData] = await Promise.all([
        CollectionService.fetchTagData(dispatch, +id).catch(err => {
          console.log("Collection Landing Error", err);
        }),
        CollectionService.fetchCollectionData(dispatch, +id).catch(err => {
          console.log("Collection Landing Error", err);
        })
      ]);
      if (tags) {
        dispatch(updateTagsData(tags));
      }

      if (collectionData) {
        dispatch(updateCollectionData(collectionData));
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
      return await Promise.resolve(tags);
    }
  };

  const getPdpProduct = (): any => {
    let hasPdpProductDetails = false;
    let pdpProductDetails;
    if (localStorage.getItem("collectionSpecificScroll")) {
      hasPdpProductDetails = true;
      const item: any = localStorage.getItem("collectionSpecificScroll");
      pdpProductDetails = JSON.parse(item);
    }
    return { hasPdpProductDetails, pdpProductDetails };
  };
  const handleProductSearch = () => {
    const pdpProductScrollId = getPdpProduct().pdpProductDetails.id;
    if (document.getElementById(pdpProductScrollId)) {
      setTimeout(() => {
        const element = document.getElementById(pdpProductScrollId);
        element ? element.scrollIntoView(true) : "";
        window.scrollBy(0, -150);
        localStorage.removeItem("collectionSpecificScroll");
      }, 1000);
      setScrollView(true);
    }
  };

  const checkForProductScroll = () => {
    const currentTimeStamp = new Date().getTime();
    let newShouldScroll;
    let pdpProductScroll;
    const hasPdpScrollableProduct = getPdpProduct();
    if (hasPdpScrollableProduct.hasPdpProductDetails) {
      pdpProductScroll = hasPdpScrollableProduct.pdpProductDetails;
      if (pdpProductScroll) {
        const pdpTimeStamp = new Date(pdpProductScroll.timestamp).getTime();
        const source = pdpProductScroll.source;
        if (source.toLowerCase() == "collectionlanding") {
          newShouldScroll = currentTimeStamp - pdpTimeStamp < 8000;

          if (newShouldScroll) {
            handleProductSearch();
          }
        }
      }
    }
  };

  const setCollectionData = (newData: string[]) => {
    if (newData?.includes("All Collections")) {
      setFilteredData([...result]);
      dispatch(updateFilteredCollectionData([...result]));
    } else {
      setFilteredData(
        result.filter(collection => multipleExist(collection?.tags, newData))
      );
      dispatch(
        updateFilteredCollectionData(
          result.filter(collection => multipleExist(collection?.tags, newData))
        )
      );
    }
  };

  useEffect(() => {
    if (!scrollView) {
      checkForProductScroll();
    }
  }, []);
  useEffect(() => {
    setCollectionData(activeFilterList);
  }, [result]);

  useEffect(() => {
    fetchData()
      .then((res: any) => {
        const hasElems = res.some((item: string) =>
          activeFilterList.includes(item)
        );
        if (!hasElems && !load) {
          setActiveFilterList(["All Collections"]);
          history.replace({ pathname: location.pathname, search: "" });
        }
        setLoad(false);
      })
      .catch(() => console.log("error"));
  }, [currency, history?.location.pathname]);

  useEffect(() => {
    if (vars?.tags) {
      setActiveFilterList(
        vars.tags.split("|").map(e => e.replace(/%20/g, " "))
      );
      setCollectionData(vars.tags.split("|").map(e => e.replace(/%20/g, " ")));
    } else {
      setActiveFilterList(["All Collections"]);
    }
  }, [vars?.tags]);

  useEffect(() => {
    const ele = document.getElementById("tagList");
    if (ele) {
      ele.scrollLeft = 0;
    }
  }, [location.pathname]);

  // setLoad(true);
  useEffect(() => {
    const activeEle = document.getElementById(activeFilterList[0]);
    setTimeout(() => {
      if (activeEle) {
        activeEle.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }, 500);
  }, [load]);

  // Filter Tag Functionality
  const activeFilterHandler = (
    ele: string,
    tagClickedFromCollection?: boolean
  ) => {
    let newData: string[] = [];
    const url = location.pathname;
    let tagUrl = "tags=";

    //This is called when tags are clicked from collection item
    if (tagClickedFromCollection) {
      newData = [ele];
    } else {
      //This is called when tags are clicked from tag filter

      if (ele === "All Collections") {
        newData = [ele];
      } else if (activeFilterList.includes(ele) && ele !== "All Collections") {
        const newArr = activeFilterList?.filter(
          tag => tag !== ele && tag !== "All Collections"
        );
        newData = newArr?.length ? [...newArr] : ["All Collections"];
      } else if (!activeFilterList.includes(ele) && ele !== "All Collections") {
        newData = [...activeFilterList, ele].filter(
          tag => tag !== "All Collections"
        );
      }
    }

    setActiveFilterList([...newData]);
    setCollectionData([...newData]);

    tagUrl = tagUrl + newData.join("|");
    history.replace(url + "?" + tagUrl);
  };

  return (
    <div>
      <CollectionFilter
        tags={tags}
        activeFilterList={activeFilterList}
        activeFilterHandler={activeFilterHandler}
      />

      <div className={styles.itemList}>
        {filteredData?.map((collectionData, i) => (
          <CollectionItem
            key={i}
            collectionData={collectionData}
            activeFilterHandler={activeFilterHandler}
          />
        ))}
      </div>
    </div>
  );
};

export default CollectionLanding;
