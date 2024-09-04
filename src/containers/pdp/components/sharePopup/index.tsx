import React, { useState, useEffect, useContext } from "react";
import styles from "./styles.scss";
import cs from "classnames";
import { useStore, useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { AppState } from "reducers/typings";
import { Context } from "components/Modal/context";
import Share from "components/Share";

type Props = {
  corporatePDP: boolean;
};

const ShareProductPopup: React.FC<Props> = ({ corporatePDP }) => {
  const { mobile } = useSelector((state: AppState) => state.device);
  const { closeModal } = useContext(Context);
  const dispatch = useDispatch();
  const history = useHistory();
  const store = useStore();

  return (
    <>
      <div
        className={cs(styles.shareProductPopup, {
          //   [styles.wishlistPopupContainer]: mobile
        })}
      >
        <Share
          mobile={mobile}
          link={`${__DOMAIN__}${location.pathname}`}
          mailSubject="Gifting Ideas"
          mailText={`${
            corporatePDP
              ? `Here's what I found, check it out on Good Earth's web boutique`
              : `Here's what I found! It reminded me of you, check it out on Good Earth's web boutique`
          } ${__DOMAIN__}${location.pathname}`}
        />
      </div>
    </>
  );
};

export default ShareProductPopup;
