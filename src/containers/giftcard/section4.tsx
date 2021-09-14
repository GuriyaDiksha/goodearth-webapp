import React, { useState, ChangeEvent, useEffect } from "react";
import cs from "classnames";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Section4Props } from "./typings";
import { Link } from "react-router-dom";
import FormCheckbox from "components/Formsy/FormCheckbox";
import Formsy from "formsy-react";
import { Currency, currencyCode } from "typings/currency";
import { useDispatch, useSelector } from "react-redux";
import GiftcardService from "services/giftcard";
import { updateBasket } from "actions/basket";
import { Basket } from "typings/basket";
import { MESSAGE } from "constants/messages";
import * as valid from "utils/validate";
import Button from "./button";
import { AppState } from "reducers/typings";

const Section4: React.FC<Section4Props> = props => {
  const [nummsg, setNummsg] = useState("");
  const {
    data: { imageUrl, recipientName, message, senderName, customPrice },
    currency,
    goback,
    next
  } = props;

  const [subscribe, setSubscribe] = useState(false);
  const code = currencyCode[currency as Currency];
  const dispatch = useDispatch();
  const { tablet } = useSelector((state: AppState) => state.device);

  const gotoNext = () => {
    if (subscribe) {
      const data = Object.assign({}, props.data);
      data["imageUrl"] = data["imageUrl"].replace("/gc", "/gc_");
      GiftcardService.addToGiftcard(dispatch, data)
        .then((res: any) => {
          const basket: Basket = res.data;
          dispatch(updateBasket(basket));
          valid.showGrowlMessage(dispatch, MESSAGE.ADD_TO_BAG_GIFTCARD_SUCCESS);
          next({}, "card");
        })
        .catch(error => {
          if (error.response.status == 406) {
            return false;
          }
          const errorMsg = error.response.data[0] || "Internal Server Error";
          setNummsg(errorMsg);
          valid.errorTracking([errorMsg], location.href);
        });
    } else {
      setNummsg("Please accept the Terms & Conditions");
      valid.errorTracking(
        ["Please accept the Terms & Conditions"],
        location.href
      );
    }
    // document.cookie = "giftcard_image=" + this.state.giftimages[this.state.selectindex] + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    // this.props.next(this.state.giftimages[this.state.selectindex]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={bootstrapStyles.row}>
      <section
        className={cs(
          globalStyles.paddTop60,
          styles.gc,
          bootstrapStyles.col12,
          {
            [styles.gcMobile]: props.mobile
          }
        )}
      >
        <div className={bootstrapStyles.row}>
          <div
            className={cs(
              bootstrapStyles.col12,
              { [bootstrapStyles.colLg5]: tablet },
              { [bootstrapStyles.colLg4]: !tablet },
              bootstrapStyles.offsetLg4,
              globalStyles.textCenter,
              styles.formBg,
              globalStyles.voffset3
            )}
          >
            <div className={cs(bootstrapStyles.row)}>
              <div
                className={cs(
                  bootstrapStyles.col10,
                  bootstrapStyles.offset1,
                  globalStyles.textCenter
                )}
              >
                <i className={styles.arrowUp}></i>
                <p
                  className={styles.backGc}
                  onClick={() => {
                    goback("form");
                  }}
                >
                  Back To Details
                </p>
              </div>
            </div>
            <div className={globalStyles.voffset2}>
              <img className={styles.width100} src={imageUrl} />
            </div>
            <div className={cs(globalStyles.voffset3, styles.giftFont)}>
              <p>Dear {recipientName}</p>
              <p className={globalStyles.voffset3}>
                You have received a Good Earth eGift card <br /> worth{" "}
                <strong className={globalStyles.cerise}>
                  {String.fromCharCode(...code)}
                  {customPrice}
                </strong>{" "}
                from
                {" " + senderName}
              </p>
            </div>
            <div className={cs(globalStyles.voffset4, styles.giftFont)}>
              <p>Their message:</p>
            </div>
            <h2>{message}</h2>
            <div></div>
            <div className={cs(styles.grey, globalStyles.voffset4)}>
              <span>xxx xxx</span>
            </div>
            <p className={cs(styles.giftFont)}>
              Apply this coupon code during checkout
            </p>
            <br />
            <li className={styles.note}>
              <div>Please Note</div>
              <ul>
                <li>All digital Gift Cards can be activated here.</li>
              </ul>
            </li>
            <div
              className={cs(
                globalStyles.voffset5,
                styles.giftFont,
                styles.loginForm
              )}
            >
              <Formsy>
                <div className={styles.categorylabel}>
                  <div className={styles.subscribe}>
                    <FormCheckbox
                      value={subscribe || false}
                      name="subscribe"
                      disable={false}
                      handleChange={(
                        event: ChangeEvent<HTMLInputElement>
                      ): void => {
                        const checked = event.currentTarget.checked;
                        if (checked) {
                          setNummsg("");
                          setSubscribe(true);
                        } else {
                          setSubscribe(false);
                        }
                      }}
                      id="subscribe"
                      label={[
                        "I agree to the ",
                        <Link
                          key="terms"
                          to="/customer-assistance/terms-conditions?id=giftcardpolicy"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms and Conditions.
                        </Link>,
                        " To know more how we keep your data safe, refer to our ",
                        <Link
                          key="privacy"
                          to="/customer-assistance/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </Link>
                      ]}
                      validations="isTrue"
                      required
                    />
                  </div>
                </div>
              </Formsy>
            </div>

            <div
              className={cs(
                bootstrapStyles.row,
                bootstrapStyles.col12,
                globalStyles.textCenter
              )}
            >
              <div className={bootstrapStyles.col12}>
                {nummsg ? (
                  <p className={cs(globalStyles.errorMsg)}>{nummsg}</p>
                ) : (
                  <p className={globalStyles.errorMsg}></p>
                )}
                <Button
                  className={globalStyles.voffset4}
                  value="add to bag"
                  onClick={gotoNext}
                />
              </div>
            </div>
            <div
              className={cs(
                bootstrapStyles.row,
                bootstrapStyles.col12,
                globalStyles.textCenter,
                globalStyles.voffset4
              )}
            >
              <div className={bootstrapStyles.col12}>
                <i className={styles.arrowDown}></i>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Section4;
