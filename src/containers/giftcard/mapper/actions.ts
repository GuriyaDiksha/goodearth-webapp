import { Dispatch } from "redux";

// import { updateFilterState } from "actions/giftcard";
import GiftcardService from "services/giftcard";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    fetchCountryList: async () => {
      const data = await GiftcardService.fetchCountryList(dispatch);
      return data;
    },
    fetchProductList: async () => {
      const data = await GiftcardService.fetchProductList(dispatch);
      return data;
    }
  };
};

export default mapActionsToProps;
