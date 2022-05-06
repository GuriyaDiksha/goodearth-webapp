import { Dispatch } from "redux";
import { ProductID } from "typings/id";

import ProductService from "services/product";

import { updateCollectionProducts } from "actions/product";
import { updateComponent, updateModal } from "../../../actions/modal";

import { updateProduct } from "actions/product";
import { getProductIdFromSlug } from "utils/url";
import { Product, PartialProductItem } from "typings/product.js";
import { updatePlpMobileView } from "actions/plp";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    fetchMoreProductsFromCollection: async (id: ProductID) => {
      const products = await ProductService.fetchCollectionProducts(
        dispatch,
        id
      );

      if (products) {
        dispatch(updateCollectionProducts(id, products));
      }
    },
    fetchProduct: async (slug: string) => {
      const id = getProductIdFromSlug(slug);
      if (id) {
        const product = await ProductService.fetchProductDetails(
          dispatch,
          id
        ).catch(err => {
          console.log("PDP API FAIL", err);
        });
        if (product) {
          dispatch(
            updateProduct({ ...product, partial: false } as Product<
              PartialProductItem
            >)
          );
        }
      }
    },
    updateComponentModal: (
      component: string,
      props: any,
      fullscreen = false,
      bodyClass?: string
    ) => {
      dispatch(updateComponent(component, props, fullscreen, bodyClass));
    },
    changeModalState: (data: boolean) => {
      dispatch(updateModal(data));
    },
    updateMobileView: (plpMobileView: "list" | "grid") => {
      dispatch(updatePlpMobileView(plpMobileView));
    }
  };
};

export default mapActionsToProps;
