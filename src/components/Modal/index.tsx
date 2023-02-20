import React from "react";
import cs from "classnames";
import { Props } from "./typings";
import styles from "./styles.scss";
import { connect } from "react-redux";
import { AppState } from "reducers/typings";
import { Context } from "./context";
import mapActionsToProps from "./mapper/actions";
import globalStyles from "styles/global.scss";
import { popupComponents } from "constants/components";

const mapStateToProps = (state: AppState) => {
  return {
    component: state.modal.component,
    props: state.modal.props,
    openModal: state.modal.openModal,
    fullscreen: state.modal.fullscreen,
    bodyClass: state.modal.bodyClass,
    classname: state.modal.classname,
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

    const ele = document.getElementById("modal-fullscreen") as HTMLDivElement;
    if (ele && this.props.classname == "slide-up-bottom-align") {
      ele.style.maxHeight = 0 + "px";
    }
    if (this.props.classname == "slide-up-bottom-align") {
      setTimeout(() => {
        changeModalState(false);
        updateQuickviewId();
      }, 500);
    } else {
      changeModalState(false);
      updateQuickviewId();
    }
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.openModal) {
      if (!document.body.classList.contains(globalStyles.noScroll)) {
        document.body.classList.add(globalStyles.noScroll);
      }
      if (!prevProps.openModal) {
        this.prevScroll = document.documentElement.scrollTop;
      }
    } else {
      if (prevProps.openModal) {
        document.body.classList.remove(globalStyles.noScroll);
        document.documentElement.scrollTop = this.prevScroll;
      }
    }

    const elem = document.getElementById("modal-fullscreen") as HTMLDivElement;
    if (elem && !elem.style.opacity) {
      elem.style.opacity = "1";
    }
    console.log(elem);
    if (elem && this.props.classname == "slide-up-bottom-align") {
      elem.style.maxHeight = "600" + "px";
    }
  }
  render() {
    const {
      bodyClass,
      classname,
      fullscreen,
      openModal,
      component,
      props
    } = this.props;

    const Comp = popupComponents[component];

    return openModal ? (
      <Context.Provider
        value={{
          closeModal: this.closeModal
        }}
      >
        <div className={cs(styles.container, classname)}>
          <div className={styles.backdrop} onClick={this.closeModal}></div>
          <div
            id="modal-fullscreen"
            className={cs(
              styles.body,
              bodyClass,
              { [styles.fullscreen]: fullscreen },
              {
                [styles.fullscreenAdjust]:
                  this.props.device.mobile && bodyClass == "mobile-3d"
              },
              {
                [styles.slideUpBottomAlign]:
                  classname == "slide-up-bottom-align"
              }
            )}
          >
            <Comp {...props} />
          </div>
        </div>
      </Context.Provider>
    ) : (
      <></>
    );
  }
}

export default connect(mapStateToProps, mapActionsToProps)(Modal);
