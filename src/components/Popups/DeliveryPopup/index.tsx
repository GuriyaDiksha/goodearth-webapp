import React, { useContext, useEffect, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import Button from "components/Button";
import FormTextArea from "components/Formsy/FormTextArea";
import Formsy from "formsy-react";

type PopupProps = {
  saveInstruction: (data: string) => any;
};

const Delivery: React.FC<PopupProps> = props => {
  const { closeModal } = useContext(Context);
  const [textarea, setTextarea] = useState("");
  const { deliveryText } = useSelector((state: AppState) => state.info);
  const { mobile } = useSelector((state: AppState) => state.device);

  // const isSafari = /^((?!chrome|android).)*safari/i.test(navigator?.userAgent);

  useEffect(() => {
    setTextarea(deliveryText);
  }, []);

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          styles.centerpageDesktopFs,
          globalStyles.textCenter
        )}
      >
        <div className={styles.headWrp}>
          <div className={styles.deliveryHead}>Delivery Instructions</div>
          <div
            className={cs(styles.cross, styles.deliveryIcon)}
            onClick={closeModal}
          >
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconCrossNarrowBig,
                styles.icon,
                styles.iconCross
              )}
            ></i>
          </div>
        </div>
        <div className={cs(globalStyles.paddT20, styles.gcTnc)}>
          <div className={styles.marginLR35}>
            <div className={styles.deliverSubheading}>
              Please provide specific delivery instructions for this order.
            </div>
            <div
              className={cs(
                globalStyles.voffset3
                // globalStyles.marginLR24,
                // globalStyles.marginLR35
              )}
            >
              <div>
                <Formsy>
                  <FormTextArea
                    className={styles.textAreaBox}
                    rows={5}
                    name="deliveryMessage"
                    value={textarea}
                    maxLength={250}
                    placeholder={
                      "Type here. For example,\n Leave my parcel with the Gaurd"
                    }
                    handleChange={(e: any) => {
                      setTextarea(e.target.value);
                    }}
                    charLimit={250}
                  ></FormTextArea>
                </Formsy>
              </div>
            </div>
            <div className={cs(globalStyles.voffset4, styles.freeInstruction)}>
              {" "}
              Your instructions help us provide you with a seamless online
              shopping experience. Kindly note, our delivery teams reserve the
              right to refuse certain instructions under special circumstances.
            </div>
          </div>
        </div>
        <div className={cs({ [styles.marginBottom]: !mobile })}>
          <Button
            variant="mediumMedCharcoalCta366"
            onClick={e => {
              e.preventDefault();
              props.saveInstruction(textarea.trim());
              closeModal();
            }}
            label={"SAVE & PROCEED"}
            className={cs({ [styles.btnFullWidthForPopup]: mobile })}
          />
        </div>
      </div>
    </div>
  );
};

export default Delivery;
