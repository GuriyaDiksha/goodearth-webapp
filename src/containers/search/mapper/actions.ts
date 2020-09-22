import { Dispatch } from "redux";

import { updateFilterState, updateOnload } from "actions/search";
import SearchService from "services/search";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    updateFacets: (data: any) => {
      // dispatch(updateFacets(data));
    },
    updateFilterData: (data: string) => {
      // dispatch(updateFilterData(data));
    },
    updateFilterState: (data: boolean) => {
      dispatch(updateFilterState(data));
    },
    updateProduct: async (filterUrl: string, listdata: any) => {
      const data = await SearchService.updateProduct(
        dispatch,
        filterUrl,
        listdata
      );
      return data;
    },
    fetchSearchProducts: async (filterUrl: string) => {
      const data = await SearchService.fetchSearchProducts(dispatch, filterUrl);
      return data;
    },
    updateOnload: (data: boolean) => {
      dispatch(updateOnload(data));
    }
  };
};

export default mapActionsToProps;
