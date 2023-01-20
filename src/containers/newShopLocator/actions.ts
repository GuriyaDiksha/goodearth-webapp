import { Dispatch } from "redux";
import ShopLocatorService from "services/shopLocator";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    fetchShopLocatorData: async () => {
      const data = await ShopLocatorService.fetchShopLocatorData(dispatch);
      return data;
    }
  };
};

export default mapActionsToProps;
