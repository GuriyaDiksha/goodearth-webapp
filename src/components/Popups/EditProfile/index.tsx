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

const EditProfile: React.FC = () => {
  const { closeModal } = useContext(Context);
  const { mobile } = useSelector((state: AppState) => state.device);
  const { email } = useSelector((state: AppState) => state.user);
  const [textarea, setTextarea] = useState("");
  const [error, setError] = useState("");
  const [reqSent, setReqSent] = useState(false);
  const dispatch = useDispatch();

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator?.userAgent);

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
              <textarea
                rows={6}
                cols={100}
                className={cs(styles.editMessage, {
                  [styles.errMsg]: error,
                  [styles.disabled]: reqSent
                })}
                value={textarea}
                maxLength={248}
                placeholder={"Write your message here"}
                autoComplete="new-password"
                onChange={(e: any) => {
                  setTextarea(e.target.value);
                }}
                disabled={reqSent}
              />
              <div>
                {error && <p className={styles.error}>{error} </p>}
                <div className={cs(styles.charLimit)}>
                  Char Limit:{" "}
                  {248 -
                    (textarea.length +
                      (isSafari
                        ? textarea?.match(/(\r\n|\n|\r)/g)?.length || 0
                        : 0))}{" "}
                  / 248
                </div>
              </div>
            </div>
            <Button
              variant="mediumMedCharcoalCta366"
              className={cs(
                {
                  [globalStyles.btnFullWidth]: mobile
                },
                globalStyles.marginT20
              )}
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
