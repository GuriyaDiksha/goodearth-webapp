import { Dispatch } from "redux";
import { ProductID } from "../../typings/id";
import ProductService from "../../services/product";
import { updateProduct } from "../../actions/product";
import { updateQuickviewId } from "../../actions/quickview";
import { Product, PartialProductItem } from "../../typings/product.js";
import { updateModal, updateComponent } from "../../actions/modal";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    fetchProductsDetails: async (id: ProductID) => {
      if (id) {
        const product = await ProductService.fetchProductDetails(dispatch, id);
        dispatch(
          updateProduct({ ...product, partial: false } as Product<
            PartialProductItem
          >)
        );
        dispatch(updateQuickviewId(id));
      } else {
        dispatch(updateQuickviewId(id));
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
    }
  };
};

export default mapActionsToProps;
