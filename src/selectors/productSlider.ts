import { ProductID } from "typings/id";
import { State } from "reducers/product/typings";
import { PartialProductItem } from "typings/product";
import { RecommendData } from "components/weRecomend/typings";

export const getProductSliderItems = (
  ids: ProductID[],
  products: State
): RecommendData[] => {
  const sliderItems: RecommendData[] = [];
  ids.map(id => {
    const product = products[id] as PartialProductItem;

    sliderItems.push({
      id: id,
      collectionName:
        (product.collections &&
          product.collections.length &&
          product.collections[0]) ||
        "",
      productUrl: product.url,
      productImage:
        (product.images &&
          product.images.length &&
          product.images[0].productImage) ||
        "",
      badgeImage: product.salesBadgeImage,
      productName: product.title,
      pricerecords: product.priceRecords,
      discountedPriceRecords: product.discountedPriceRecords,
      discount: product.discount,
      badgeType: product.badgeType
    });
  });

  return sliderItems;
};
