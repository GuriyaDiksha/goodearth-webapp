import { updateComponent, updateModal } from "../../../actions/modal";
import { updateQuickviewId } from "actions/quickview";
import { ReactNode } from "react";
import { Dispatch } from "redux";
import { updatePlpMobileView } from "actions/plp";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    updateComponentModal: (component: ReactNode, fullscreen?: boolean) => {
      dispatch(updateComponent(component, fullscreen));
    },
    changeModalState: (data: boolean) => {
      dispatch(updateModal(data));
    },
    updateQuickviewId: async () => {
      dispatch(updateQuickviewId(0));
    },
    updateMobileView: (plpMobileView: "list" | "grid") => {
      dispatch(updatePlpMobileView(plpMobileView));
    }
  };
};

export default mapActionsToProps;
