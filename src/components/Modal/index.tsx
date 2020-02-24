import React from "react";
import { unmountComponentAtNode } from "react-dom";
import cs from "classnames";

import { Props } from "./typings";

import { Context } from "./context";

import styles from "./styles.scss";
import useOutsideDetection from "hooks/useOutsideDetetion";

const Modal = <T extends HTMLElement>({
  bodyClassName,
  children,
  parentNode,
  className
}: Props<T>) => {
  const closeModal = () => {
    unmountComponentAtNode(parentNode);
  };

  const { ref } = useOutsideDetection<HTMLDivElement>(closeModal);

  const Provider = Context.Provider;

  return (
    <Provider
      value={{
        closeModal
      }}
    >
      <div className={cs(styles.container, className)}>
        <div className={styles.backdrop} onClick={closeModal}></div>
        <div className={cs(styles.body, bodyClassName)} ref={ref}>
          {children}
        </div>
      </div>
    </Provider>
  );
};

export default Modal;
