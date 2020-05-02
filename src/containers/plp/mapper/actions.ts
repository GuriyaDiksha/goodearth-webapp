import { Dispatch } from "redux";

import { updateFacets } from "actions/plp";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    updateFacets: (data: any) => {
      dispatch(updateFacets(data));
    }
  };
};

export default mapActionsToProps;
