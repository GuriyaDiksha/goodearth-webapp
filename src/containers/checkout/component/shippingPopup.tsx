import React from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
// import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { PopupProps } from "./typings";
const ShippingPopup: React.FC<PopupProps> = props => {
  //   const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={cs(globalStyles.cerise, styles.cross)}>
      <div className="size-block size-block-1 size-block-not-fixed centerpage-desktop centerpage-mobile text-center">
        <div className="cross" onClick={props.closeModal}>
          <i className="icon icon_cross"></i>
        </div>
        <div className="gc-tnc">
          <div className="c22-A-I voffset7">Please Note</div>
          <div className="c10-L-R">
            <p>
              Your safety is our priority. All standard WHO guidelines and
              relevant precautionary measures are in place, to ensure a safe and
              secure shopping experience for you.
            </p>
            <p>
              We are delighted to have resumed shipping, both worldwide and
              select locations within India, permissible under government
              directives. Please use our Pincode Detector to check if your area
              (within India) is currently serviceable.
            </p>
            <p>
              Apply code: <b>SAVE20</b> at checkout to avail a special discount
              on <span className="cerise">International orders</span>, valid
              from{" "}
              <span className="cerise">
                1st July till 10th July 2020, midnight IST
              </span>
              .
            </p>
            <p>
              For any further assistance reach out to us at{" "}
              <b className="cerise">customercare@goodearth.in</b>
            </p>
            <p>
              <b>Happy shopping!</b>
            </p>
          </div>
          <div className="cerise-btn">
            <a onClick={props.acceptCondition}>OK</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPopup;
