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
    bodyClass: state.modal.bodyClass,
    currency: state.currency,
    device: state.device
  };
};

type ModalProps = Props &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapActionsToProps>;

class Modal extends React.Component<ModalProps> {
  prevScroll = 0;
  closeModal = () => {
    localStorage.removeItem("tempEmail");
    const { changeModalState, updateQuickviewId } = this.props;
    changeModalState(false);
    updateQuickviewId();
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.openModal) {
      if (!prevProps.openModal) {
        this.prevScroll = document.documentElement.scrollTop;
        document.body.classList.add(globalStyles.noScroll);
      }
    } else {
      if (prevProps.openModal) {
        document.body.classList.remove(globalStyles.noScroll);
        document.documentElement.scrollTop = this.prevScroll;
      }
    }
  }

  render() {
    const {
      bodyClass,
      className,
      fullscreen,
      openModal,
      component
    } = this.props;

    return openModal ? (
      <Context.Provider
        value={{
          closeModal: this.closeModal
        }}
      >
        <div className={cs(styles.container, className)}>
          <div className={styles.backdrop} onClick={this.closeModal}></div>
          <div
            className={cs(styles.body, bodyClass, {
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
