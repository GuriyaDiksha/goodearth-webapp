import { InitAction } from "typings/actions";
import CategoryService from "services/category";
import { CategoryProps } from "typings/category";
import { addCategoryData } from "actions/category";
import { getProductIdFromSlug, getProductNameFromSlug } from "utils/url.ts";

const initActionCategory: InitAction = async (dispatch, { slug }) => {
  const id = getProductIdFromSlug(slug);
  const name = getProductNameFromSlug(slug)?.toUpperCase();
  if (id) {
    const [
      shopthelook1,
      shopthelook2,
      editSection,
      topliving,
      peoplebuying,
      newarrival
    ] = await Promise.all([
      CategoryService.fetchCategoryMultiImage(`CAT_${id}_1`),
      CategoryService.fetchCategoryMultiImage(`CAT_${id}_2`),
      CategoryService.fetchCategoryMultiImage(`${name}CURATED`),
      CategoryService.fetchCategoryMultiImage(`TOP${name}`),
      CategoryService.fetchLatestProduct(id),
      CategoryService.newarrivals(id)
    ]);
    const data: CategoryProps = {
      shopthelook1: shopthelook1,
      shopthelook2: shopthelook2,
      editSection: editSection,
      topliving: topliving,
      peoplebuying: peoplebuying,
      newarrival: newarrival
    };
    dispatch(addCategoryData({ ...data }));
  }
};

export default initActionCategory;
