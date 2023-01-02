import { Dispatch } from "redux";
import GiftcardService from "services/giftcard";
import { updateBasket } from "actions/basket";
import { Basket } from "typings/basket";
import { showGrowlMessage } from "utils/validate";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    fetchCountryList: async () => {
      const data = await GiftcardService.fetchCountryList(dispatch);
      return data;
    },
    fetchProductList: async () => {
      const data = await GiftcardService.fetchProductList(dispatch);
      return data;
    },
    addToGiftcard: async (data: any) => {
      const result = await GiftcardService.addToGiftcard(dispatch, data);
      return result;
    },
    updateBasket: (basket: Basket) => {
      dispatch(updateBasket(basket));
    },
    showGrowlMessage: (string: string) => {
      showGrowlMessage(dispatch, string);
    }
  };
};

export default mapActionsToProps;
