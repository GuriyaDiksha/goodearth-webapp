import { ProductID } from "typings/id";
import { State } from "reducers/product/typings";
import { PartialProductItem } from "typings/product";
import { RecommendData } from "src/components/weRecomend/typings";

export const getProductSliderItems = (
  ids: ProductID[],
  products: State
): RecommendData[] => {
  const sliderItems: RecommendData[] = [];
  ids.map(id => {
    const product = products[id] as PartialProductItem;

    sliderItems.push({
      collectionName:
        (product.collections &&
          product.collections.length &&
          product.collections[0]) ||
        "",
      productUrl: product.url,
      productImage:
        (product.plpImages &&
          product.plpImages.length &&
          product.plpImages[0]) ||
        "",
      badgeImage: product.salesBadgeImage,
      productName: product.title,
      pricerecords: product.priceRecords,
      sku: "",
      title: ""
    });
  });

  return sliderItems;
};
