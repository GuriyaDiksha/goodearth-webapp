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
      peoplebuying
      // newarrival
    ] = await Promise.all([
      CategoryService.fetchCategoryMultiImage(dispatch, `CAT_${id}_1`).catch(
        err => {
          console.log("Colloection Page error =" + id);
        }
      ),
      CategoryService.fetchCategoryMultiImage(dispatch, `CAT_${id}_2`).catch(
        err => {
          console.log("Colloection Page error CAT_=" + id);
        }
      ),
      CategoryService.fetchCategoryMultiImage(dispatch, `${name}CURATED`).catch(
        err => {
          console.log("Colloection Page error CURATED =" + id);
        }
      ),
      CategoryService.fetchCategoryMultiImage(dispatch, `TOP${name}`).catch(
        err => {
          console.log("Colloection Page error TOP =" + id);
        }
      ),
      CategoryService.fetchLatestProduct(dispatch, id).catch(err => {
        console.log("Colloection Page error =" + id);
      })
      // CategoryService.newarrivals(dispatch,id).catch(err => {
      //   console.log("Colloection Page error =" + id);
      // })
    ]);
    const data: CategoryProps = {
      shopthelook1: shopthelook1,
      shopthelook2: shopthelook2,
      editSection: editSection,
      topliving: topliving,
      peoplebuying: peoplebuying,
      newarrival: {}
    };
    dispatch(addCategoryData({ ...data }));
  }
};

export default initActionCategory;
