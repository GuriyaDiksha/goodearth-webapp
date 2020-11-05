import React, { useState, ChangeEvent, useEffect } from "react";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Section4Props } from "./typings";
import { Link } from "react-router-dom";
import FormCheckbox from "components/Formsy/FormCheckbox";
import Formsy from "formsy-react";
import { Currency, currencyCode } from "typings/currency";
import { useDispatch } from "react-redux";
import GiftcardService from "services/giftcard";
import { updateBasket } from "actions/basket";
import { Basket } from "typings/basket";
import { showMessage } from "actions/growlMessage";
import { ADD_TO_BAG_GIFTCARD_SUCCESS } from "constants/messages";
import * as valid from "utils/validate";

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

  const gotoNext = () => {
    if (subscribe) {
      const data = Object.assign({}, props.data);
      data["imageUrl"] = data["imageUrl"].replace("/gc", "/gc_");
      GiftcardService.addToGiftcard(dispatch, data)
        .then((res: any) => {
          const basket: Basket = res.data;
          dispatch(updateBasket(basket));
          dispatch(showMessage(ADD_TO_BAG_GIFTCARD_SUCCESS));
          next({}, "card");
        })
        .catch(error => {
          if (error.response.status == 406) {
            return false;
          }
          setNummsg("Internal Server Error");
          valid.errorTracking(["Internal Server Error"], location.href);
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
        className={cs(globalStyles.paddTop60, styles.gc, {
          [styles.gcMobile]: props.mobile
        })}
      >
        <div className={bootstrapStyles.row}>
          <div
            className={cs(
              bootstrapStyles.col12,
              bootstrapStyles.colMd4,
              bootstrapStyles.offsetMd4,
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
              <img src={imageUrl} />
            </div>
            <div className={cs(globalStyles.voffset3, styles.giftFont)}>
              <p>Dear {recipientName}</p>
              <p className={globalStyles.voffset3}>
                You have received a Good Earth eGift card <br /> worth{" "}
                <strong className={globalStyles.cerise}>
                  {String.fromCharCode(code)}
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
                <div
                  className={cs(
                    styles.bannerBtnLink,
                    iconStyles.icon,
                    globalStyles.voffset4
                  )}
                  onClick={() => {
                    gotoNext();
                  }}
                >
                  <span>add to bag</span>
                </div>
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
