import { Dispatch } from "redux";
import { ProductID } from "typings/id";

import ProductService from "services/product";

import { updateCollectionProducts } from "actions/product";
import { updateComponent, updateModal } from "../../../actions/modal";
import { ReactNode } from "react";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    fetchMoreProductsFromCollection: async (id: ProductID) => {
      const products = await ProductService.fetchCollectionProducts(id);

      if (products && products.length) {
        dispatch(updateCollectionProducts(id, products));
      }
    },
    updateComponentModal: (component: ReactNode, fullscreen = false) => {
      dispatch(updateComponent(component, fullscreen));
    },
    changeModalState: (data: boolean) => {
      dispatch(updateModal(data));
    }
  };
};

export default mapActionsToProps;
