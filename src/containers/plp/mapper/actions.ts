import { Dispatch } from "redux";

import {
  updateFacets,
  updateFilterData,
  updateFilterState,
  updateOnload
} from "actions/plp";
import PlpService from "services/plp";
import { updateScrollDown } from "actions/info";

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
    },
    fetchPlpTemplates: async (categoryShop: string) => {
      try {
        await PlpService.fetchPlpTemplates(dispatch, categoryShop);
      } catch (err) {
        console.log("fetch Plp Templates error!! ", err);
      }
    },
    updateOnload: (data: boolean) => {
      dispatch(updateOnload(data));
    },
    updateScrollDown: (scrollDown: boolean) => {
      dispatch(updateScrollDown(scrollDown));
    }
  };
};

export default mapActionsToProps;
