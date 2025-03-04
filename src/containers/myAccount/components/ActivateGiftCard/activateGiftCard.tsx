import React, { Fragment, useRef, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import { GiftState } from "./typings";
import GiftCardItem from "../Balance/giftDetail";
import { AppState } from "reducers/typings";
import FormInput from "components/Formsy/FormInput";
import Formsy from "formsy-react";
import OtpCompActivateGC from "components/OtpComponent/OtpCompActivateGC";
import Loader from "components/Loader";
import { Link } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { useSelector, useDispatch } from "react-redux";
import AccountServices from "services/account";
import { showGrowlMessage, errorTracking, getErrorList } from "utils/validate";
import Button from "components/Button";
import { censorEmail } from "utils/utility";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

const Giftcard: React.FC = () => {
  const {
    user,
    device: { mobile }
  } = useSelector((state: AppState) => state);
  const [giftCardState, setGiftCardState] = useState<GiftState>({
    txtvalue: "",
    firstName: user?.isLoggedIn ? user?.firstName : "",
    lastName: user?.isLoggedIn ? user?.lastName : "",
    error: "",
    newCardBox: true,
    giftList: [],
    showOTPValidationScreen: false,
    isSuccess: false,
    toggleResetOtpComponent: false,
    disable: true,
    conditionalRefresh: false,
    showLocked: false,
    showExpired: false,
    showInactive: false,
    showSendOtp: false,
    isIndiaGC: false,
    isProceedBtnDisabled: true,
    isLoading: false,
    activatedGcMsg: ""
  });
  const [isGCVerificationDisabled, setIsGCVerificationDisabled] = useState(
    false
  );
  const dispatch = useDispatch();
  const ActivateGCForm = useRef<Formsy | null>(null);

  const toggleOtp = (value: boolean) => {
    setGiftCardState({ ...giftCardState, showOTPValidationScreen: value });
  };

  // const gcBalance = () => {
  //   const data: any = {
  //     // code: this.state.txtvalue
  //   };
  //   AccountServices.balanceCheck(dispatch,data).then((response: any) => {
  //     const { giftList } =giftCardState;
  //     if (response.currStatus == "Invalid-CN") {
  //       setGiftCardState(
  //         {...giftCardState,
  //           error: "Please enter a valid Gift Card code"
  //         })
  //         errorTracking(["Please enter a valid Gift Card code"], location.href);
  //       ActivateGCForm.current?.updateInputsWithError({
  //         giftCardCode: "Please enter a valid Gift Card code"
  //       });
  //     } else {
  //       giftList.push(response);
  //       setGiftCardState({...giftCardState,
  //         giftList: giftList,
  //         newCardBox: false
  //         // txtvalue: ""
  //       });
  //     }
  //   });
  // };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const { disable } = giftCardState;
    disable && setGiftCardState({ ...giftCardState, disable: false });
    const value = event.target.value;
    switch (field) {
      case "firstName":
        setGiftCardState({ ...giftCardState, firstName: value });
        break;
      case "lastName":
        setGiftCardState({ ...giftCardState, lastName: value });
        break;
      case "txtvalue":
        setGiftCardState({ ...giftCardState, txtvalue: value });
    }
  };

  const updateList = (response: any) => {
    const { giftList } = giftCardState;
    if (response.currStatus == "Invalid-CN") {
      setGiftCardState({
        ...giftCardState,
        error: "Please enter a valid Gift Card code"
      });
      errorTracking([giftCardState?.error], location.href);
    } else {
      giftList.push(response);
      setGiftCardState({
        ...giftCardState,
        giftList: giftList,
        newCardBox: false,
        isSuccess: true,
        activatedGcMsg:
          "This Gift Card has been successfully activated and is now linked to the email address provided in your profile. Gift cards are not transferable."
        // txtvalue: ""
      });
      //Show  Growl Messsage
      const msg = "Success. Gift Card Activated!";
      showGrowlMessage(dispatch, msg, 7000);
      window.scrollTo(0, 0);
    }
  };

  const newGiftcard = () => {
    // implement page refresh here
    setGiftCardState({
      ...giftCardState,
      toggleResetOtpComponent: !giftCardState?.toggleResetOtpComponent,
      showOTPValidationScreen: false,
      newCardBox: true,
      disable: true,
      isSuccess: false,
      giftList: [],
      txtvalue: "",
      showSendOtp: false,
      activatedGcMsg: ""
    });
    // this.props.history.push(this.props.history.location.pathname, {});
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "activate_another_giftcard"
      });
    }
  };
  const onClose = (code: string) => {
    let { giftList } = giftCardState;
    giftList = giftList.filter(data => {
      return data.code != code;
    });
    setGiftCardState({
      ...giftCardState,
      giftList: giftList
    });
  };

  const scrollToErrors = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLInputElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      // for error Tracking
      const errorList = getErrorList(
        globalStyles.errorMsg,
        "activate-giftcard-form"
      );
      if (errorList && errorList.length) {
        errorTracking(errorList, location.href);
      }
    }, 0);
  };
  const updateError = (message: string) => {
    if (message) {
      setGiftCardState({
        ...giftCardState,
        error: message
      });
      ActivateGCForm.current?.updateInputsWithError({
        giftCardCode: message
      });
      const elem: any = document.getElementById("gift");
      elem.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };

  const errorOnBlur = (event: React.FocusEvent<Element>) => {
    const elem = event.currentTarget as HTMLInputElement;
    const value = elem.value;
    const name = elem.name;

    if (!value) {
      ActivateGCForm.current &&
        ActivateGCForm.current.updateInputsWithValue(
          {
            [name]: ""
          },
          true
        );
    }
  };

  const validateEmptyInputs = () => {
    if (ActivateGCForm.current) {
      const {
        firstName,
        lastName,
        giftCardCode
      } = ActivateGCForm.current.getModel();
      let values = {};
      if (!firstName) {
        values = { ...values, firstName: "" };
      }
      if (!lastName) {
        values = { ...values, lastName: "" };
      }
      if (!giftCardCode) {
        values = { ...values, giftCardCode: "" };
      }

      ActivateGCForm.current.updateInputsWithValue(values, true);
      scrollToErrors();
    }
  };

  const onGCFormSubmit = (model: any, resetForm: any, invalidateForm: any) => {
    const { firstName, lastName, giftCardCode } = model;
    if (!firstName || !lastName || !giftCardCode) {
      validateEmptyInputs();
      return false;
    }

    setGiftCardState({
      ...giftCardState,
      isLoading: true
    });

    AccountServices.checkGiftCard(dispatch, giftCardCode)
      .then(res => {
        setGiftCardState({
          ...giftCardState,
          isLoading: false
        });

        if (res.status === false) {
          ActivateGCForm.current &&
            ActivateGCForm.current.updateInputsWithError(
              {
                giftCardCode: [res.message || "An error occurred"]
              },
              true
            );
          setGiftCardState({
            ...giftCardState,
            isProceedBtnDisabled: true
          });
        } else {
          if (res.currStatus === "Not Activated") {
            setGiftCardState({
              ...giftCardState,
              showSendOtp: true,
              isIndiaGC: res.curr === "INR"
            });
          } else {
            ActivateGCForm.current &&
              ActivateGCForm.current.updateInputsWithError(
                {
                  giftCardCode: [
                    <>
                      {res.message?.includes("already activated")
                        ? `${res.message.replace(/\./g, "")} with ${censorEmail(
                            res.activatorEmail
                          )}`
                        : res.message}
                    </>
                  ]
                },
                true
              );
            setGiftCardState({
              ...giftCardState,
              isProceedBtnDisabled: true
            });
          }
        }
      })
      .catch(err => {
        setGiftCardState({
          ...giftCardState,
          isLoading: false
        });
        if (
          (err.response.status == 400 && err.response.data.status == false) ||
          err.response.status == 406
        ) {
          ActivateGCForm.current &&
            ActivateGCForm.current.updateInputsWithError(
              {
                giftCardCode: err.response.data.message
                  ? [ReactHtmlParser(err.response.data.message)]
                  : "Please enter a valid Gift Card code"
              },
              true
            );
          setGiftCardState({
            ...giftCardState,
            isProceedBtnDisabled: true
          });
        }
      });
  };

  const changeGiftCardCode = () => {
    setIsGCVerificationDisabled(true);
    setGiftCardState({
      ...giftCardState,
      showSendOtp: false,
      txtvalue: ""
    });
    const elem = document.getElementById("gift");
    elem && elem.focus();
    const userConsent = CookieService.getCookie("consent").split(",");
    const giftCardCode: string = giftCardState?.txtvalue || "";
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "change_gift_code",
        gift_card_code: giftCardCode
      });
    }
  };

  const sendOtpGiftcard = async (data: any) => {
    return await AccountServices.sendOtpGiftcard(dispatch, data);
  };

  const checkOtpBalance = async (data: any) => {
    return await AccountServices.checkOtpBalance(dispatch, data);
  };

  const activateGiftCard = async (data: any) => {
    return await AccountServices.activateGiftCard(dispatch, data);
  };

  const { isLoggedIn } = user;
  const {
    firstName,
    lastName,
    txtvalue,
    newCardBox,
    isLoading,
    isProceedBtnDisabled,
    showOTPValidationScreen,
    showSendOtp,
    conditionalRefresh,
    giftList,
    disable,
    toggleResetOtpComponent,
    isIndiaGC,
    activatedGcMsg
  } = giftCardState;

  return (
    <Fragment>
      {newCardBox && (
        <div>
          <Formsy
            ref={ActivateGCForm}
            onValidSubmit={onGCFormSubmit}
            onInvalidSubmit={scrollToErrors}
            onChange={() => {
              isProceedBtnDisabled &&
                setGiftCardState({
                  ...giftCardState,
                  isProceedBtnDisabled: false
                });
            }}
          >
            <div className={styles.categorylabel} id="activate-giftcard-form">
              {showOTPValidationScreen ? (
                ""
              ) : (
                <Fragment>
                  <div>
                    <FormInput
                      name="firstName"
                      placeholder="First Name"
                      type="text"
                      blur={e => errorOnBlur(e)}
                      id="firstName"
                      label={"First Name"}
                      value={firstName}
                      handleChange={e => handleChange(e, "firstName")}
                      required
                    />
                  </div>
                  <div>
                    <FormInput
                      name="lastName"
                      placeholder="Last Name"
                      type="text"
                      label={"Last Name"}
                      blur={e => errorOnBlur(e)}
                      id="lastName"
                      value={lastName}
                      handleChange={e => handleChange(e, "lastName")}
                      required
                    />
                  </div>
                  <div className={styles.gcWrp}>
                    <FormInput
                      name="giftCardCode"
                      type="text"
                      placeholder="Gift Card Code"
                      label="Gift Card Code"
                      blur={e => errorOnBlur(e)}
                      id="gift"
                      value={txtvalue}
                      handleChange={e => handleChange(e, "txtvalue")}
                      disable={showSendOtp}
                      keyDown={e => e.key === " " && e.preventDefault()}
                      required={!isGCVerificationDisabled}
                    />
                    {showSendOtp && (
                      <p
                        className={styles.loginChange}
                        onClick={changeGiftCardCode}
                      >
                        Change
                      </p>
                    )}
                  </div>
                  {!showSendOtp && (
                    <div>
                      <Button
                        onClick={() => setIsGCVerificationDisabled(false)}
                        type="submit"
                        label="proceed"
                        disabled={isProceedBtnDisabled}
                        variant="mediumMedCharcoalCta366"
                      />
                    </div>
                  )}
                </Fragment>
              )}
            </div>
          </Formsy>
          {isLoading && <Loader />}
        </div>
      )}
      {showSendOtp && (
        <OtpCompActivateGC
          disableSendOtpButton={disable}
          toggleReset={toggleResetOtpComponent}
          updateError={updateError}
          txtvalue={txtvalue}
          firstName={firstName}
          lastName={lastName}
          isIndiaGC={isIndiaGC}
          toggleOtp={toggleOtp}
          otpFor="activateGC"
          email={isLoggedIn ? user.email : ""}
          phoneNo={isLoggedIn ? user.phoneNumber : ""}
          code={isLoggedIn ? user.phoneCountryCode : ""}
          // validateInputs={this.ActivateGCForm.current ? this.ActivateGCForm.current.submit : () => null}
          // validateInputs={this.scrollToErrors}
          validateEmptyInputs={validateEmptyInputs}
          key={200}
          sendOtp={sendOtpGiftcard}
          checkOtpBalance={checkOtpBalance}
          activateGiftCard={activateGiftCard}
          updateList={updateList}
          newCardBox={newCardBox}
          newGiftCard={newGiftcard}
          mobile={mobile}
          isLoggedIn={user?.isLoggedIn}
          activatedGcMsg={activatedGcMsg}
        />
      )}
      <div className={cs(bootstrapStyles.row, styles.giftDisplay)}>
        {giftList.map((data, i) => {
          return (
            <GiftCardItem
              isLoggedIn={isLoggedIn}
              {...data}
              viewOnly={true}
              onClose={onClose}
              key={i}
              conditionalRefresh={conditionalRefresh}
            />
          );
        })}
        <div className={cs(styles.loginForm, bootstrapStyles.col12)}>
          {!newCardBox && (
            <div
              className={cs(
                styles.rtcinfo,
                globalStyles.pointer,
                styles.charcoalBtn
              )}
              onClick={newGiftcard}
            >
              ACTIVATE ANOTHER GIFT CARD
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Giftcard;
