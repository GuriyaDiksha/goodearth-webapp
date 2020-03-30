import { Dispatch } from "redux";
import { ProductID } from "typings/id";

import ProductService from "services/product";

import { updateCollectionProducts } from "actions/product";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    fetchMoreProductsFromCollection: async (id: ProductID) => {
      const products = await ProductService.fetchCollectionProducts(id);

      if (products && products.length) {
        dispatch(updateCollectionProducts(id, products));
      }
    }
  };
};

export default mapActionsToProps;
