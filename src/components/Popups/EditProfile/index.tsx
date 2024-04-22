import React, { useContext, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import AccountService from "services/account";
import Button from "components/Button";
import FormTextArea from "components/Formsy/FormTextArea";
import Formsy from "formsy-react";

const EditProfile: React.FC = () => {
  const { closeModal } = useContext(Context);
  const { mobile } = useSelector((state: AppState) => state.device);
  const { email } = useSelector((state: AppState) => state.user);
  const [textarea, setTextarea] = useState("");
  const [error, setError] = useState("");
  const [reqSent, setReqSent] = useState(false);
  const dispatch = useDispatch();

  const onRequestSend = () => {
    const formData: any = {};
    formData["email"] = email || "";
    formData["reqMessage"] = textarea || "";

    setError("");

    if (textarea.length < 15) {
      setError("Please write your complete request.");
      return false;
    }

    if (!reqSent) {
      AccountService.sendProfileEditRequest(dispatch, formData)
        .then(() => {
          setReqSent(true);
        })
        .catch((e: any) => {
          setError(e);
        });
    }
  };

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          { [styles.centerpageDesktopFs]: !mobile },
          globalStyles.textCenter,
          { [styles.centerpageDesktopFsWidth]: mobile }
        )}
      >
        <div className={styles.cross} onClick={closeModal}>
          <i
            className={cs(
              iconStyles.icon,
              iconStyles.iconCrossNarrowBig,
              styles.icon,
              styles.iconCross,
              styles.freeShippingPopup
            )}
          ></i>
        </div>
        <div className={cs(styles.gcTnc)}>
          <div
            className={cs(styles.editProfileHead, {
              [globalStyles.marginT30]: mobile
            })}
          >
            Update Profile Request
          </div>
          {/* <div className={globalStyles.c10LR}> */}
          <div className={styles.editProfile}>
            <p>Your Request:</p>
            <div className={cs(globalStyles.voffset2)}>
              <Formsy>
                <FormTextArea
                  rows={6}
                  name="editProfileMessage"
                  value={textarea}
                  maxLength={248}
                  placeholder={"Write your message here"}
                  handleChange={(e: any) => {
                    setError("");
                    setTextarea(e.target.value);
                  }}
                  disable={reqSent}
                  charLimit={248}
                  error={error}
                  additionalErrorClass={styles.leftFloat}
                ></FormTextArea>
              </Formsy>
            </div>
            <Button
              variant="mediumMedCharcoalCta366"
              className={cs(globalStyles.marginT20)}
              onClick={onRequestSend}
              disabled={reqSent}
              label={reqSent ? "request sent!" : "send request"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
