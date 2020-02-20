import { Dispatch } from "redux";
import { ProductID } from "typings/id";

import ProductService from "services/product";

import { updatePartialProducts } from "actions/product";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    fetchMoreProductsFromCollection: async (id: ProductID) => {
      const products = await ProductService.fetchCollectionProducts(id);
      dispatch(updatePartialProducts(id, products));
    }
  };
};

export default mapActionsToProps;
