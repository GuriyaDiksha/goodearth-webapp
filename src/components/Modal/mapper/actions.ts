import { updateComponent, updateModal } from "../../../actions/modal";
import { ReactNode } from "react";
import { Dispatch } from "redux";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    updateComponentModal: (component: ReactNode) => {
      dispatch(updateComponent(component));
    },
    changeModalState: (data: boolean) => {
      dispatch(updateModal(data));
    }
  };
};

export default mapActionsToProps;
