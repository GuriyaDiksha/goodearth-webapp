import { updateComponent, updateModal } from "../../../actions/modal";
import { updateQuickviewId } from "actions/quickview";
import { Dispatch } from "redux";
import { updatePlpMobileView } from "actions/plp";

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    updateComponentModal: (
      component: string,
      props: any,
      fullscreen?: boolean,
      bodyClass?: string,
      classname?: string
    ) => {
      dispatch(
        updateComponent(component, props, fullscreen, bodyClass, classname)
      );
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
