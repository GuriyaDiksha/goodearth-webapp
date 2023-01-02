import { Dispatch } from "redux";
// import { updateFilterState } from "actions/giftcard";
import GiftcardService from "services/giftcard";
import { refreshPage } from "actions/user";

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
    refreshPage: () => {
      dispatch(refreshPage(undefined));
    }
  };
};

export default mapActionsToProps;
