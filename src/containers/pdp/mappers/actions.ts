import { Dispatch } from "redux";
import { ProductID } from "typings/id";

import ProductService from "services/product";

import { updateCollectionProducts } from "actions/product";
import { updateComponent, updateModal } from "../../../actions/modal";
import { ReactNode } from "react";

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
