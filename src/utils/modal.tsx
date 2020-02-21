import React, { ReactNode } from "react";
import { render } from "react-dom";
import Modal from "components/Modal";
import { Props } from "components/Modal/typings";

export const renderModal = (
  component: ReactNode,
  modalProps?: Props<HTMLDivElement>
) => {
  const container = document.getElementById(
    "modal-container"
  ) as HTMLDivElement;

  render(
    <>
      <Modal parentNode={container} {...modalProps}>
        {component}
      </Modal>
    </>,
    container
  );
};
