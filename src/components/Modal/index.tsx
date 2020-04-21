import React from "react";
import cs from "classnames";
import { Props } from "./typings";
import styles from "./styles.scss";
import { connect } from "react-redux";
import { AppState } from "reducers/typings";
import { Context } from "./context";
import mapActionsToProps from "./mapper/actions";
import globalStyles from "styles/global.scss";

const mapStateToProps = (state: AppState) => {
  return {
    component: state.modal.component,
    openModal: state.modal.openModal,
    fullscreen: state.modal.fullscreen,
    currency: state.currency,
    device: state.device
  };
};

type ModalProps = Props &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapActionsToProps>;

class Modal extends React.Component<ModalProps> {
  closeModal = () => {
    const { changeModalState } = this.props;
    changeModalState(false);
  };

  render() {
    const {
      bodyClassName,
      className,
      fullscreen,
      openModal,
      component
    } = this.props;
    if (openModal) {
      document.body.classList.add(globalStyles.noscroll);
    } else {
      document.body.classList.remove(globalStyles.noscroll);
    }
    return openModal ? (
      <Context.Provider
        value={{
          closeModal: this.closeModal
        }}
      >
        <div className={cs(styles.container, className)}>
          <div className={styles.backdrop} onClick={this.closeModal}></div>
          <div
            className={cs(styles.body, bodyClassName, {
              [styles.fullscreen]: fullscreen
            })}
          >
            {component}
          </div>
        </div>
      </Context.Provider>
    ) : (
      <></>
    );
  }
}

export default connect(mapStateToProps, mapActionsToProps)(Modal);
