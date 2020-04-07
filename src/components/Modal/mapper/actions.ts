import { useStore } from "react-redux";
import { updateComponent, updateModal } from "../../../actions/modal";
import { ReactNode } from "react";

const mapActionsToProps = () => {
  const store = useStore();
  return {
    updateComponentModal: (component: ReactNode) => {
      store.dispatch(updateComponent(component));
    },
    changeModalState: (data: boolean) => {
      store.dispatch(updateModal(data));
    }
  };
};

export default mapActionsToProps;
