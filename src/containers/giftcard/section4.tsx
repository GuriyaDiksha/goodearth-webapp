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
import { AppState } from "reducers/typings";
import Loader from "components/Loader";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

const Section4: React.FC<Section4Props> = props => {
  const [nummsg, setNummsg] = useState("");
  const {
    data: {
      imageUrl,
      recipientName,
      message,
      senderName,
      customPrice,
      recipientEmail
    },
    currency,
    goback,
    next
  } = props;

  const [subscribe, setSubscribe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isErr, setIsErr] = useState(false);
  const code = currencyCode[currency as Currency];
  const dispatch = useDispatch();
  const { tablet, mobile } = useSelector((state: AppState) => state.device);

  const gotoNext = () => {
    if (subscribe) {
      const data = Object.assign({}, props.data);
      data["imageUrl"] = data["imageUrl"].replace("/gc", "/gc_");
      setIsLoading(true);
      GiftcardService.addToGiftcard(dispatch, data)
        .then((res: any) => {
          const userConsent = CookieService.getCookie("consent").split(",");
          if (userConsent.includes(GA_CALLS)) {
            dataLayer.push({
              event: "card_add_to_cart",
              design: data.imageUrl,
              location: props.selectedCountry,
              value: data.customPrice
            });
          }

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
        })
        .finally(() => {
          setIsLoading(false);
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
        style={{ paddingBottom: props.mobile ? 0 : "50px" }}
      >
        <div className={bootstrapStyles.row}>
          <div
            className={cs(
              bootstrapStyles.col12,
              { [bootstrapStyles.colLg5]: tablet },
              { [bootstrapStyles.colLg4]: !tablet },
              bootstrapStyles.offsetLg4,
              globalStyles.textCenter,
              globalStyles.voffset3
            )}
          >
            <div className={cs(bootstrapStyles.col10, globalStyles.textLeft)}>
              <p
                className={styles.backGc}
                onClick={() => {
                  goback("form");
                }}
              >
                {`<`} Back To Details
              </p>
            </div>
          </div>
        </div>
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
            style={{ paddingBottom: props.mobile ? 0 : "40px" }}
          >
            <div className={cs(bootstrapStyles.row)}></div>
            <div className={globalStyles.voffset2}>
              <img className={styles.width65} src={imageUrl} />
            </div>
            <div className={styles.giftHeading}>Recipient Email:</div>
            <div className={styles.recipientFont}>{recipientEmail}</div>
            <div className={cs(globalStyles.voffset4, styles.giftFont)}>
              <p>Dear {recipientName}</p>
              <p className={globalStyles.voffset3}>
                You have received a Good Earth eGift card <br /> worth{" "}
                <span className={styles.aqua}>
                  {String.fromCharCode(...code)}
                  {"  "}
                  {customPrice}
                </span>{" "}
                from
                {" " + senderName}
              </p>
            </div>
            <div className={cs(globalStyles.voffset4, styles.smallHeadText)}>
              <p>Their message:</p>
            </div>
            <h2 className={styles.messageText}>{message}</h2>
            <div></div>
            <div className={cs(styles.grey, globalStyles.voffset4)}>
              <span>xxx xxx</span>
            </div>
            <p className={cs(styles.smallHeadText)}>
              Apply this coupon code during checkout
            </p>
            <hr />
            <li className={styles.note}>
              <div>
                Please Note:All our gift cards are valid for a period of 11
                months from date of purchase.
              </div>
            </li>
            <div
              className={cs(
                globalStyles.voffset5,
                styles.giftFont,
                styles.loginForm
              )}
            >
              <Formsy
                onInvalid={() => {
                  setIsErr(true);
                }}
                onValid={() => {
                  setIsErr(false);
                }}
              >
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
                    {nummsg ? (
                      <p
                        className={cs(styles.errorMsg, globalStyles.paddLeft10)}
                      >
                        {nummsg}
                      </p>
                    ) : (
                      <p
                        className={cs(styles.errorMsg, globalStyles.paddLeft10)}
                      ></p>
                    )}
                    {tablet && (
                      <div
                        className={cs(bootstrapStyles.col12, styles.buttonRow)}
                      >
                        <div className={cs(styles.imageSelectBtnContainer)}>
                          <button
                            className={cs(styles.imageSelectBtn, {
                              [styles.errorBtn]: isErr
                            })}
                            onClick={!isLoading ? gotoNext : () => null}
                          >
                            Add To Bag
                          </button>
                        </div>
                      </div>
                    )}
                    {!mobile && (
                      <div
                        className={cs(
                          bootstrapStyles.col12,
                          globalStyles.marginT40,
                          styles.buttonRow
                        )}
                      >
                        <div className={cs(styles.imageSelectBtnContainer)}>
                          <button
                            className={cs(styles.imageSelectBtn, {
                              [styles.errorBtn]: isErr
                            })}
                            onClick={!isLoading ? gotoNext : () => null}
                          >
                            Add To Bag
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Formsy>
            </div>
            {/* <div
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
                  onClick={!isLoading ? gotoNext : () => null}
                />
              </div>
            </div> */}
          </div>
        </div>
      </section>
      {mobile && !tablet && (
        <div
          className={cs(bootstrapStyles.col12, styles.buttonRow, {
            [styles.buttonSticky]: mobile
          })}
        >
          <div className={cs(styles.imageSelectBtnContainer)}>
            <button
              className={cs(
                styles.imageSelectBtn,
                {
                  [styles.section2FullWidth]: mobile
                },
                {
                  [styles.errorBtn]: isErr
                }
              )}
              onClick={!isLoading ? gotoNext : () => null}
            >
              Add To Bag
            </button>
          </div>
        </div>
      )}

      {isLoading && <Loader />}
    </div>
  );
};

export default Section4;
