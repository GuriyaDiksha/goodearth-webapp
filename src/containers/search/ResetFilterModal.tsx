import React from "react";
import cs from "classnames";
import styles from "./styles.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";

type Props = {
  applyClick: any;
  discardClick: any;
};
const ResetFilterModal: React.FC<Props> = props => {
  const applyFilter = () => {
    props.applyClick();
  };

  const discardFilter = () => {
    props.discardClick();
  };

  return (
    <div className={styles.resetModalContainer}>
      <div className={cs(bootstrapStyles.row)}>
        <div className={styles.discardPopup}>
          <div className={styles.popupContent}>
            <div className={styles.heading}>Discard Changes?</div>
            <div className={styles.innerText}>
              You have modified some filters. Would you like to apply the
              changes or discard them?
            </div>
            <div className={styles.applyLink} onClick={applyFilter}>
              APPLY FILTERS
            </div>
            <div className={styles.discardCta} onClick={discardFilter}>
              DISCARD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetFilterModal;
