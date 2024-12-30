import React from "react";
import styles from "./styles.scss";
import cs from "classnames";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import Share from "components/Share";
import CloseButton from "components/Modal/components/CloseButton";

type Props = {
  corporatePDP: boolean;
  productName: string;
  productUrl?: string;
};

const ShareProductPopup: React.FC<Props> = ({
  corporatePDP,
  productName,
  productUrl
}) => {
  const { mobile } = useSelector((state: AppState) => state.device);
  return (
    <>
      <div className={styles.shareProductPopup}>
        {mobile && (
          <>
            <div className={styles.header}>
              <CloseButton className={styles.closeBtn} />
            </div>
            <h3 className={styles.heading}>Share via</h3>
          </>
        )}
        <Share
          mobile={mobile}
          // link={`${__DOMAIN__}${location.pathname}`}
          link={`${__DOMAIN__}${productUrl}`}
          productName={productName}
          mailSubject="Gifting Ideas"
          mailText={`${
            corporatePDP
              ? `Here's what I found, check it out on Good Earth's web boutique`
              : `Here's what I found! It reminded me of you, check it out on Good Earth's web boutique`
          } ${__DOMAIN__}${productUrl}`}
        />
      </div>
    </>
  );
};

export default ShareProductPopup;
