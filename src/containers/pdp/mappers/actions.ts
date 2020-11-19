import { Dispatch } from "redux";
import { ProductID } from "typings/id";

import ProductService from "services/product";

import { updateCollectionProducts } from "actions/product";
import { updateComponent, updateModal } from "../../../actions/modal";
import { ReactNode } from "react";

import { updateProduct } from "actions/product";
import { getProductIdFromSlug } from "utils/url.ts";
import { Product, PartialProductItem } from "typings/product.js";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    fetchMoreProductsFromCollection: async (id: ProductID) => {
      const products = await ProductService.fetchCollectionProducts(
        dispatch,
        id
      );

      if (products && products.length) {
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
      component: ReactNode,
      fullscreen = false,
      bodyClass?: string
    ) => {
      dispatch(updateComponent(component, fullscreen, bodyClass));
    },
    changeModalState: (data: boolean) => {
      dispatch(updateModal(data));
    }
  };
};

export default mapActionsToProps;
