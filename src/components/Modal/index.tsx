import React from "react";
import cs from "classnames";
import { Props } from "./typings";
import styles from "./styles.scss";
import { connect } from "react-redux";
import { AppState } from "reducers/typings";

const mapStateToProps = (state: AppState) => {
  return {
    component: state.modal.component,
    openModal: state.modal.openModal,
    currency: state.currency,
    device: state.device
  };
};

type ModalProps = Props & ReturnType<typeof mapStateToProps>;

class Modal extends React.Component<ModalProps> {
  closeModal = () => {
    // this.setState({
    //   openModal:false
    // })
  };

  render() {
    const {
      bodyClassName,
      className,
      fullscreen,
      openModal,
      component
    } = this.props;
    return openModal ? (
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
    ) : (
      <></>
    );
  }
}

export default connect(mapStateToProps)(Modal);
