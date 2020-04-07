import { useStore } from "react-redux";
import { ProductID } from "../../typings/id";
import ProductService from "../../services/product";
import { updateProduct } from "../../actions/product";
import { updateQuickviewId } from "../../actions/quickview";
import { Product, PartialProductItem } from "../../typings/product.js";
import { updateModal } from "../../actions/modal";

const mapActionsToProps = () => {
  const store = useStore();
  return {
    fetchProductsDetails: async (id: ProductID) => {
      if (id) {
        const product = await ProductService.fetchProductDetails(id);
        store.dispatch(
          updateProduct({ ...product, partial: false } as Product<
            PartialProductItem
          >)
        );
        store.dispatch(updateQuickviewId(id));
      }
    },
    changeModalState: (data: boolean) => {
      store.dispatch(updateModal(data));
    }
  };
};

export default mapActionsToProps;
