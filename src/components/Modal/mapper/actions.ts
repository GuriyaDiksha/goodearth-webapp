import { updateComponent, updateModal } from "../../../actions/modal";
import { ReactNode } from "react";
import { Dispatch } from "redux";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    updateComponentModal: (component: ReactNode, fullscreen?: boolean) => {
      dispatch(updateComponent(component, fullscreen));
    },
    changeModalState: (data: boolean) => {
      dispatch(updateModal(data));
    }
  };
};

export default mapActionsToProps;
