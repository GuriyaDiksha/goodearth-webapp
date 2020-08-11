import { updateComponent, updateModal } from "../../../actions/modal";
import { updateQuickviewId } from "actions/quickview";
import { ReactNode } from "react";
import { Dispatch } from "redux";

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
    }
  };
};

export default mapActionsToProps;
