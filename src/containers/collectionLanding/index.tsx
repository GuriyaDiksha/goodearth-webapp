import React, { useEffect, useState } from "react";
import CollectionFilter from "components/Collection/CollectionFilter";
import CollectionItem from "components/Collection/CollectionItem";
import styles from "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { CollectionItemType } from "components/Collection/CollectionItem/typing";
import { getProductIdFromSlug } from "utils/url";
import { useHistory, useLocation } from "react-router";
import CollectionService from "services/collection";
import {
  updateCollectionData,
  updateFilteredCollectionData,
  updateTagsData
} from "actions/collection";

const arr = [
  {
    id: 533,
    name: "Guzargah",
    displayImage: "",
    subHeader: "",
    shortDescription:
      "<p>A winter collection of wool and silk apparel with vibrant embroidery to brighten up the season</p>",
    longDescription: "test long for 3rd tag",
    categoryName: [],
    sliderImages: [
      "https://d3qn6cjsz7zlnp.cloudfront.net/media/images/collection/Digvijay_Philosophy26248.jpg",
      "https://d3qn6cjsz7zlnp.cloudfront.net/media/images/collection/Digvijay_Philosophy26161.jpg"
    ],
    header: "",
    url: "/collection/women_guzargah_533/",
    tags: ["tag1", "mera tag", "Test 3", "Test 2"]
  },
  {
    id: 535,
    name: "Sindhuri",
    displayImage: "",
    subHeader: "",
    shortDescription: "Short Descrition 1234",
    longDescription: "Long Descrition 1",
    categoryName: [],
    sliderImages: [
      "https://d3qn6cjsz7zlnp.cloudfront.net/media/images/collection/Sindhuri_Mens_Wear_Catalog_shoot27582.jpg",
      "https://d3qn6cjsz7zlnp.cloudfront.net/media/images/collection/Sindhuri_Mens_Wear_Catalog_shoot27416.jpg",
      "https://d3qn6cjsz7zlnp.cloudfront.net/media/images/collection/Sindhuri_Mens_Wear_Catalog_shoot27517.jpg"
    ],
    header: "",
    url: "/collection/women_sindhuri_535/",
    tags: ["tag2", "Test 2"]
  }
];
const CollectionLanding = () => {
  const [activeFilterList, setActiveFilterList] = useState<string[]>([
    "All Collections"
  ]);
  const [scrollView, setScrollView] = useState(false);
  const [filteredData, setFilteredData] = useState<CollectionItemType[]>([]);
  const {
    collection: { result, tags },
    router: { location },
    currency
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const level1 = urlParams.get("level1");
  const history = useHistory();

  const vars: { tags?: string } = {};
  const re = /[?&]+([^=&]+)=([^&]*)/gi;
  let match;

  while ((match = re.exec(search))) {
    vars[match[1]] = match[2];
  }

  useEffect(() => {
    if (vars?.tags) {
      setActiveFilterList(
        vars.tags.split("|").map(e => e.replace(/%20/g, " "))
      );
    }
  }, [vars?.tags]);

  const multipleExist = (data: string[], filter: string[]) => {
    return filter.some(value => {
      return data.includes(value);
    });
  };

  const fetchData = async () => {
    const id = getProductIdFromSlug(level1 || "");
    if (id) {
      const [tags, collectionData] = await Promise.all([
        CollectionService.fetchTagData(dispatch).catch(err => {
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

  useEffect(() => {
    if (!scrollView) {
      checkForProductScroll();
    }
  }, []);
  useEffect(() => {
    setFilteredData([...arr]);
    dispatch(updateFilteredCollectionData([...arr]));
  }, [result]);

  useEffect(() => {
    fetchData();
  }, [location?.pathname, currency]);

  // Filter Tag Functionality
  const activeFilterHandler = (ele: string) => {
    let newData: string[] = [];
    const url = location.pathname;
    let tagUrl = "tags=";
    if (ele === "All Collections" && !activeFilterList.includes(ele)) {
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

    setActiveFilterList([...newData]);
    if (newData?.includes("All Collections")) {
      setFilteredData([...arr]);
      dispatch(updateFilteredCollectionData([...arr]));
    } else {
      setFilteredData(
        arr.filter(collection => multipleExist(collection?.tags, newData))
      );
      dispatch(
        updateFilteredCollectionData(
          arr.filter(collection => multipleExist(collection?.tags, newData))
        )
      );
    }

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
          <CollectionItem key={i} collectionData={collectionData} />
        ))}
      </div>
    </div>
  );
};

export default CollectionLanding;
