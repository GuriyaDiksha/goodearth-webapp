import { Dispatch } from "redux";

import { updateFacets, updateFilterData, updateFilterState } from "actions/plp";
import PlpService from "services/plp";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    updateFacets: (data: any) => {
      dispatch(updateFacets(data));
    },
    updateFilterData: (data: string) => {
      dispatch(updateFilterData(data));
    },
    updateFilterState: (data: boolean) => {
      dispatch(updateFilterState(data));
    },
    updateProduct: async (filterUrl: string, listdata: any) => {
      const data = await PlpService.updateProduct(
        dispatch,
        filterUrl,
        listdata
      );
      return data;
    },
    fetchPlpProducts: async (filterUrl: string) => {
      const data = await PlpService.fetchPlpProducts(dispatch, filterUrl);
      return data;
    }
  };
};

export default mapActionsToProps;
