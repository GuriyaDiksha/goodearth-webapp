import { updateComponent, updateModal } from "../../../actions/modal";
import { updateQuickviewId } from "actions/quickview";
import { Dispatch } from "redux";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    updateComponentModal: (
      component: string,
      props: any,
      fullscreen?: boolean
    ) => {
      dispatch(updateComponent(component, props, fullscreen));
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
