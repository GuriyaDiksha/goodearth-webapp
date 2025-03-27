import React, { ChangeEvent } from "react";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect, DispatchProp } from "react-redux";
import Formsy from "formsy-react";
import FormSelect from "../../components/Formsy/FormSelect";
import styles from "./styles.scss";
import mapDispatchToProps from "./mapper/actions";
import { Currency, currencyCode } from "typings/currency";
import * as util from "utils/validate";
import FormInput from "components/Formsy/FormInput";
import FormTextArea from "components/Formsy/FormTextArea";
import FormCheckbox from "components/Formsy/FormCheckbox";
import { Link } from "react-router-dom";
import { Basket } from "typings/basket";
import { MESSAGE } from "constants/messages";
import { displayPriceWithCommas, makeid } from "utils/utility";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Button from "components/Button";
import globalStyles from "styles/global.scss";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

// import { table } from "console";

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    device: state.device,
    saleTimer: state.info.showTimer,
    cookies: state.cookies,
    customerGroup: state.user.customerGroup,
    isLoggedIn: state.user.isLoggedIn
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  DispatchProp &
  RouteComponentProps;

type State = {
  giftImages: string[];
  selectedImage: string;
  productData: any;
  countryData: any;
  selectedCountry: string;
  // sku: string;
  cardId: string;
  cardValue: string;
  customValue: string;
  currencyCharCode: number[];
  currency: Currency;
  recipientName: string;
  recipientEmail: string;
  confirmRecipientEmail: string;
  message: string;
  senderName: string;
  englishandSpace: RegExp;
  subscribe: boolean;
  customValueErrorMsg: string;
  // selectCountryErrorMsg: string;
  previewOpen: boolean;
  formDisabled: boolean;
  key: string;
  ribbonImgUrl: string;
};

class NewGiftcard extends React.Component<Props, State> {
  // isSafari =
  //   typeof window !== "undefined"
  //     ? /^((?!chrome|android).)*safari/i.test(window.navigator?.userAgent)
  //     : false;
  observer?: IntersectionObserver;
  container: HTMLDivElement | null = null;
  constructor(props: Props) {
    super(props);
    this.state = {
      giftImages: [
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/gcnew2.png",
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/gcnew1.png",
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/gcnew3.png"
      ],
      selectedImage:
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/gcnew2.png",
      ribbonImgUrl:
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/Ribbon.png",
      productData: [],
      countryData: [],
      selectedCountry: "",
      // sku: "I00121125",
      cardId: "",
      cardValue: "",
      currencyCharCode: [],
      currency: props.currency,
      recipientName: "",
      recipientEmail: "",
      confirmRecipientEmail: "",
      message: "Here is a gift for you!",
      senderName: "",
      englishandSpace: /^[a-zA-Z\s]+$/,
      subscribe: false,
      customValueErrorMsg: "",
      // selectCountryErrorMsg: "",
      customValue: "",
      previewOpen: false,
      formDisabled: true,
      key: makeid(5)
    };
  }

  onImageClick = (img: string) => {
    this.setState({ selectedImage: img });
  };

  resetStateOnSuccess = () => {
    const newCurrency = this.props.currency;
    let newCountry = "";
    if (this.props.currency == "INR") {
      newCountry = "India";
    } else if (this.props.currency == "GBP") {
      newCountry = "United Kingdom";
    } else if (this.props.currency == "AED") {
      newCountry = "United Arab Emirates";
    } else if (this.props.currency == "SGD") {
      newCountry = "Singapore";
    } else if (this.props.currency == "USD") {
      newCountry = "";
    }
    if (newCountry) {
      this.setState({
        currency: newCurrency,
        selectedCountry: newCountry,
        // selectCountryErrorMsg: "",
        currencyCharCode: currencyCode[newCurrency]
      });
    } else {
      this.setState({
        currency: newCurrency,
        selectedCountry: "",
        // selectCountryErrorMsg: "Please select your Country",
        currencyCharCode: currencyCode[newCurrency]
      });
    }
    // dont make maker false
    this.setState({
      selectedImage:
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/gcNew2.png",
      cardId: "",
      cardValue: "",
      recipientName: "",
      recipientEmail: "",
      confirmRecipientEmail: "",
      // commenting bcz we don't want to remove default message
      message: "Here is a gift for you!",
      senderName: "",
      subscribe: false,
      customValue: "",
      //previewOpen: false,
      formDisabled: true,
      key: makeid(5)
    });
  };

  compare = (a: any, b: any) => {
    const { currency } = this.props;
    return (
      parseInt(b.priceRecords[currency]) - parseInt(a.priceRecords[currency])
    );
  };

  onCountrySelect = (e: any) => {
    const { countryData, currency } = this.state;
    const country = e.target.value;
    const newCurrency = countryData?.[country];
    const newCurrencyCode = currencyCode?.[newCurrency];
    this.setState(
      {
        selectedCountry: country
        // selectCountryErrorMsg: ""
      },
      () => {
        if (newCurrency != currency) {
          const data: any = { currency: newCurrency };
          this.props.changeCurrency(data).then(res => {
            this.props.reloadPage(
              this.props.cookies,
              newCurrency,
              this.props.customerGroup
            );
          });

          this.setState({
            currency: newCurrency,
            currencyCharCode: newCurrencyCode,
            cardId: "",
            cardValue: "",
            customValue: "",
            customValueErrorMsg: ""
          });
        }
        CookieService.setCookie("country", country, 365);
        CookieService.setCookie("countryCode", newCurrency, 365);
        this.props.updateRegion({ country });
      }
    );
  };

  customValueCheck = (value: string | number) => {
    let status = false;
    let msg = "";
    const { currency } = this.state;

    //TODO: To generate data. Can be fetched from an API
    const currencyList = ["INR", "USD", "GBP", "AED", "SGD"];
    const minLimits = ["5,000", "50", "50", "100", "100"];
    const maxLimits = ["5,00,000", "8,000", "5,500", "25,000", "10,000"];

    let limitsList: any = {};
    currencyList.map((curr, i) => {
      const limit = {
        [currencyList[i]]: {
          min: minLimits[i],
          max: maxLimits[i]
        }
      };
      limitsList = Object.assign(limitsList, limit);
    });
    // =======================================================//

    const minString = (currency: string) => {
      return `Sorry, the minimum value of Gift Card is ${String.fromCharCode(
        ...currencyCode[currency]
      )} ${
        limitsList[currency].min
      }. Please enter a value greater than or equal to ${String.fromCharCode(
        ...currencyCode[currency]
      )} ${limitsList[currency].min}.`;
    };

    const maxString = (currency: string) => {
      return `Sorry, the maximum value of Gift card is ${String.fromCharCode(
        ...currencyCode[currency]
      )} ${
        limitsList[currency].max
      }. Please enter a value less than or equal to ${String.fromCharCode(
        ...currencyCode[currency]
      )} ${limitsList[currency].max}.`;
    };

    if (+value < +limitsList[currency].min.replaceAll(",", "")) {
      status = true;
      msg = minString(currency);
    } else if (+value > +limitsList[currency].max.replaceAll(",", "")) {
      status = true;
      msg = maxString(currency);
    }

    return { sta: status, message: msg };
  };

  onCardValueClick = (e: any) => {
    this.setState({
      cardId: e.target.getAttribute("id"),
      customValueErrorMsg: "",
      customValue: "",
      cardValue: e.target.getAttribute("data-value")
    });
  };

  onCustomValueChange = (e: any) => {
    if (e.target.value.length > 10) return;

    const { sta, message } = this.customValueCheck(e.target.value);
    if (sta) {
      this.setState({
        cardId: "",
        customValue: e.target.value,
        cardValue: "",
        customValueErrorMsg: message
      });
    } else {
      this.setState({
        cardId: e.target.getAttribute("id"),
        customValue: e.target.value,
        cardValue: "",
        customValueErrorMsg: ""
      });
    }
  };

  onRecipientNameChange = (e: any) => {
    this.setState({
      recipientName: e.target.value
    });
  };

  onRecipientEmailChange = (e: any) => {
    this.setState({
      recipientEmail: e.target.value
    });
  };

  onConfirmRecipientEmailChange = (e: any) => {
    this.setState({
      confirmRecipientEmail: e.target.value
    });
  };

  onMessageChange = (e: any) => {
    if (e.target.value.length > 248) {
      this.setState({
        message: e.target.value.substr(0, 248)
      });
      return false;
    } else {
      this.setState({
        message: e.target.value
      });
    }
  };

  onSenderNameChange = (e: any) => {
    this.setState({
      senderName: e.target.value
    });
  };

  onSubmit = (e: any) => {
    const {
      selectedImage,
      cardValue,
      cardId,
      message,
      recipientEmail,
      recipientName,
      senderName,
      customValue,
      formDisabled,
      selectedCountry,
      customValueErrorMsg
    } = this.state;
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "gift_card_buy",
        value: cardValue ? cardValue : customValue,
        shipping: selectedCountry
      });
    }
    sessionStorage.setItem("GCCountrySelected", selectedCountry);
    if (formDisabled || selectedCountry == "") {
      return;
    }
    if (customValueErrorMsg.length > 0) {
      return;
    }
    const data = Object.assign(
      {},
      {
        imageUrl: selectedImage.replace("/gc", "/gc_"),
        customPrice: cardValue || customValue,
        productId: cardId,
        message: message,
        recipientEmail: recipientEmail,
        recipientName: recipientName,
        senderName: senderName,
        quantity: 1
      }
    );

    if (!this.props.isLoggedIn) {
      this.props.goLogin(undefined, "/giftcard");
    } else {
      this.props
        .addToGiftcard(data)
        .then((res: any) => {
          // Redirect to gc_checkout page
          this.setState({ formDisabled: true });
          this.props.history.push("/order/gc_checkout");
          this.resetStateOnSuccess();
          const basket: Basket = res.data;
          this.props.updateBasket(basket);
          this.props.showGrowlMessage(MESSAGE.ADD_TO_BAG_GIFTCARD_SUCCESS);
        })
        .catch(error => {
          this.props.showGrowlMessage(
            "Internal Server Error. Please try again later."
          );
          if (error.response.status == 406) {
            return false;
          }
        });
    }
  };

  onSeePreviewClick = () => {
    this.setState({
      previewOpen: true
    });
  };

  onBackToGcClick = () => {
    this.setState({
      previewOpen: false
    });
  };

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.currency != this.props.currency) {
      const newCurrency = this.props.currency;
      let newCountry = "";
      if (this.props.currency == "INR") {
        newCountry = "India";
      } else if (this.props.currency == "GBP") {
        newCountry = "United Kingdom";
      } else if (this.props.currency == "AED") {
        newCountry = "United Arab Emirates";
      } else if (this.props.currency == "SGD") {
        newCountry = "Singapore";
      } else if (this.props.currency == "USD") {
        newCountry = "";
      }
      if (newCountry) {
        this.setState({
          currency: newCurrency,
          selectedCountry: newCountry,
          // selectCountryErrorMsg: "",
          currencyCharCode: currencyCode[newCurrency],
          cardId: "",
          cardValue: "",
          customValue: "",
          customValueErrorMsg: ""
        });
      } else {
        this.setState({
          currency: newCurrency,
          selectedCountry: "",
          currencyCharCode: currencyCode[newCurrency],
          cardId: "",
          cardValue: "",
          customValue: "",
          customValueErrorMsg: ""
        });
      }
    }
  }

  observerCallback = (entries: IntersectionObserverEntry[]) => {
    //bottom < 130 && ratio > 0
    const ele = document.getElementById("show-preview");
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (ele) {
        if (
          // entry.intersectionRatio > 0 ||
          // entry.boundingClientRect.bottom < 130 ||
          entry.isIntersecting === true
        ) {
          ele.style.display = "none";
        } else {
          ele.style.display = "block";
        }
      }
    });
  };

  onScroll = () => {
    if (this.container) {
      this.observer = new IntersectionObserver(this.observerCallback, {
        rootMargin: "-130px 0px -110px 0px"
      });
      this.observer.observe(this.container);
    }
  };

  componentDidMount() {
    document.addEventListener("scroll", this.onScroll);
    const { fetchCountryList, fetchProductList } = this.props;
    fetchProductList().then((data: any) => {
      this.setState({
        productData: data
      });
    });
    fetchCountryList().then((response: any) => {
      this.setState({
        countryData: response.data
      });
      let newCountry = "";
      if (this.props.currency == "INR") {
        newCountry = "India";
      } else if (this.props.currency == "GBP") {
        newCountry = "United Kingdom";
      } else if (this.props.currency == "AED") {
        newCountry = "United Arab Emirates";
      } else if (this.props.currency == "SGD") {
        newCountry = "Singapore";
      } else if (this.props.currency == "USD") {
        // this.setState({
        //   selectCountryErrorMsg: "Please Select a Country"
        // });
      }
      newCountry &&
        this.setState({
          selectedCountry: newCountry
        });
    });
    this.setState({
      currencyCharCode: currencyCode[this.props.currency]
    });
    util.pageViewGTM("GiftCard");
    // Show login pop up if not logged in and redirect to giftcard page
    // if (!this.props.isLoggedIn) {
    //   this.props.goLogin(undefined, "/giftcard");
    // }
  }

  render(): React.ReactNode {
    const { mobile, tablet } = this.props.device;
    const {
      giftImages,
      selectedImage,
      countryData,
      productData,
      selectedCountry,
      currency,
      // sku,
      cardId,
      cardValue,
      currencyCharCode,
      recipientName,
      englishandSpace,
      recipientEmail,
      confirmRecipientEmail,
      message,
      senderName,
      subscribe,
      customValueErrorMsg,
      // selectCountryErrorMsg,
      customValue,
      previewOpen,
      formDisabled,
      key
    } = this.state;
    const list = Object.keys(countryData).map(key => {
      return {
        label: key,
        value: key
      };
    });

    return (
      <div
        className={cs(styles.pageContainer, {
          [styles.saleTimerMargin]: this.props.saleTimer
        })}
        key={key}
      >
        <div className={styles.banner}>
          <div className={styles.bannerText}>The Art of Gifting</div>
        </div>
        <div className={styles.pageBody}>
          <div className={styles.container}>
            <div
              className={cs(styles.previewGc, {
                [styles.saleTimerPosition]: this.props.saleTimer
              })}
              ref={ele => (this.container = ele)}
            >
              <div className={styles.title}>Preview</div>
              <div className={styles.imageContainer}>
                <div className={styles.giftWrapper}>
                  <img src={selectedImage} alt="giftcard preview" />
                  <img
                    className={styles.ribbonImg}
                    src={this.state.ribbonImgUrl}
                    alt="ribbonImg"
                  />
                </div>
              </div>
              <div className={styles.salutation}>
                Dear {recipientName ? recipientName : `[Receiver's Name]`}
              </div>
              <div className={styles.staticMsg}>
                You have received a Good Earth eGift card worth
              </div>
              <div className={styles.gcAmount}>
                &nbsp;
                {+cardValue > 0
                  ? displayPriceWithCommas(cardValue, currency)
                  : +customValue > 0
                  ? displayPriceWithCommas(customValue, currency)
                  : ""}
              </div>
              <div className={styles.senderName}>
                From {senderName ? senderName : `[Sender's Name]`}
              </div>
              <div className={styles.theirMessage}>Their Message:</div>
              <div className={styles.message}>{message}</div>
              <div className={styles.theirMessage}>
                Apply this code during checkout :
              </div>
              <div className={styles.dummyCode}>
                <span>xxxxxx</span>
              </div>
              <div className={styles.note}>
                Please Note: All our gift cards are valid for a period of 11
                months from date of purchase.
              </div>
            </div>
            <div className={styles.formGc}>
              <div className={styles.formHeader}>E-Gift Card</div>
              {/* 1. Card Design */}
              <div className={styles.cardDesign}>
                <div className={styles.sectionTitle}>Card Design</div>
                <div className={styles.designsContainer}>
                  {giftImages.map((img, i) => {
                    return (
                      <div
                        className={cs(styles.imgOptions, {
                          [styles.selected]: img == selectedImage
                        })}
                        onClick={() => this.onImageClick(img)}
                        key={`gift_${i}`}
                      >
                        <img src={img} alt="giftcard-img" />
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* 2. Shipping Destination */}
              <div className={styles.shippingDestination}>
                <div className={styles.sectionTitle}>Shipping Destination</div>
                <div className={styles.selectGroup}>
                  <Formsy>
                    <FormSelect
                      required
                      label=""
                      value={selectedCountry}
                      countryData={this.state.countryData}
                      currencyCharCode={this.state.currencyCharCode}
                      placeholder="Select Country"
                      options={list}
                      handleChange={this.onCountrySelect}
                      name="country"
                      validations={{
                        isExisty: true
                      }}
                      validationErrors={{
                        isExisty: "This field is required"
                      }}
                      errWithIsPristine={true}
                    />
                  </Formsy>
                  {/* {selectCountryErrorMsg && (
                    <div className={styles.errorMessage}>
                      {selectCountryErrorMsg}
                    </div>
                  )} */}
                </div>
                <div className={styles.note}>
                  Please note: Gift cards can only be redeemed in the currency
                  they are bought in, so please choose the country based on your
                  recipient’s address
                </div>
              </div>
              {/* 3. Card Value */}
              <div className={styles.cardValue}>
                <div className={styles.sectionTitle}>Card Value</div>
                <div className={styles.pricesContainer}>
                  {productData.sort(this.compare).map((pro: any) => {
                    return !pro.title.toLowerCase().includes("dynamic") ? (
                      <div
                        key={pro.sku}
                        onClick={(e: any) => {
                          this.onCardValueClick(e);
                        }}
                        data-value={pro.priceRecords[currency]}
                        className={cs({
                          [styles.selected]: cardId == pro.id
                        })}
                        id={pro.id}
                      >
                        {displayPriceWithCommas(
                          pro.priceRecords[currency],
                          currency
                        )}
                      </div>
                    ) : (
                      ""
                    );
                  })}
                </div>
                <div className={styles.sectionTitle}>
                  (or choose your own value)
                </div>
                {/* Custom Value Input */}
                <form>
                  {productData.map((pro: any) => {
                    return pro.title.toLowerCase().includes("dynamic") ? (
                      <div className={styles.customValueInput} key={pro.sku}>
                        <input
                          type="number"
                          id={pro.id}
                          placeholder="Enter Custom Value"
                          onChange={this.onCustomValueChange}
                          value={customValue}
                          className={cs({
                            [styles.aquaBorder]: customValue != ""
                          })}
                          onKeyPress={e => {
                            const regex = /^[0-9]+$/;
                            if (regex.test(e.key)) {
                              this.onCustomValueChange(e);
                            } else {
                              e.preventDefault();
                              return false;
                            }
                          }}
                          onPaste={e => {
                            e.preventDefault();
                            return false;
                          }}
                        />
                        <div className={styles.curr}>
                          {" "}
                          {String.fromCharCode(...currencyCharCode)}{" "}
                        </div>
                      </div>
                    ) : (
                      ""
                    );
                  })}
                  {customValueErrorMsg && (
                    <div className={styles.errorMessage}>
                      {customValueErrorMsg}
                    </div>
                  )}
                </form>
              </div>
              {/* 4.E-Gift Card Details */}
              <div className={styles.eGiftCardDetails}>
                <div className={styles.customMargin}>E-GIFT CARD DETAILS</div>
                <Formsy
                  onValid={() => {
                    this.setState({
                      formDisabled: false
                    });
                  }}
                  onInvalid={() => {
                    this.setState({
                      formDisabled: true
                    });
                  }}
                >
                  <FormInput
                    name="recipientName"
                    placeholder={"Recipient's Name"}
                    label={"Recipient's Name *"}
                    value={recipientName}
                    handleChange={this.onRecipientNameChange}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    validations={{
                      isEnglish: (values, value) => {
                        if (value) {
                          const bool = englishandSpace.test(value);
                          return bool;
                        } else return true;
                      }
                    }}
                    validationErrors={{
                      isEnglish: "Only alphabets are allowed"
                    }}
                    required
                    style={{ marginTop: "22px" }}
                  />
                  <FormInput
                    name="recipientEmail"
                    placeholder={"Recipient's Email"}
                    label={"Recipient's Email *"}
                    handleChange={this.onRecipientEmailChange}
                    value={recipientEmail}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    validations={{
                      isEmail: true,
                      maxLength: 75
                    }}
                    validationErrors={{
                      isEmail: "Please enter a valid Email ID",
                      maxLength:
                        "You are allowed to enter upto 75 characters only"
                    }}
                    required
                  />
                  <FormInput
                    name="recipientEmailConfirm"
                    placeholder={"Confirm Recipient's Email"}
                    label={"Confirm Recipient's Email *"}
                    handleChange={this.onConfirmRecipientEmailChange}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    value={confirmRecipientEmail}
                    isDrop={true}
                    isPaste={true}
                    validations={{
                      isEmail: true,
                      maxLength: 75,
                      equalsField: "recipientEmail"
                    }}
                    validationErrors={{
                      isEmail: "Please enter a valid Email ID",
                      maxLength:
                        "You are allowed to enter upto 75 characters only",
                      equalsField: "The entered Email ID does not match"
                    }}
                    required
                  />
                  <FormTextArea
                    additionalErrorClass={styles.leftFloat}
                    placeholder=""
                    maxLength={248}
                    name="message"
                    rows={6}
                    value={message}
                    id="sender_msg"
                    handleChange={e => {
                      this.onMessageChange(e);
                    }}
                    required
                    validations={{
                      isEmpty: (values, value) => {
                        return value?.trim() ? true : false;
                      }
                    }}
                    validationErrors={{
                      isEmpty: "Please enter your message"
                    }}
                    charLimit={248}
                  ></FormTextArea>
                  <FormInput
                    name="senderName"
                    placeholder={"Sender's Name"}
                    label={"Sender's Name *"}
                    value={senderName}
                    handleChange={this.onSenderNameChange}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    validations={{
                      isEnglish: (values, value) => {
                        if (value) {
                          const bool = englishandSpace.test(value);
                          return bool;
                        } else return true;
                      }
                    }}
                    validationErrors={{
                      isEnglish: "Only alphabets are allowed"
                    }}
                    required
                  />
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
                          this.setState({ subscribe: true });
                        } else {
                          this.setState({ subscribe: false });
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
                          Privacy Policy.
                        </Link>
                      ]}
                      validations="isTrue"
                      required
                    />
                  </div>
                </Formsy>
              </div>
              {/* 5. Add to Bag */}
              {!mobile && (
                <Button
                  variant="mediumAquaCta366"
                  onClick={this.onSubmit}
                  label={this.props.isLoggedIn ? "BUY NOW" : "LOGIN & BUY"}
                  disabled={
                    !(!formDisabled && selectedCountry != "" && cardId != "")
                  }
                />
              )}
              {/* 6. Contact Us */}
              <div className={styles.contactUs}>
                <div className={styles.queriesTitle}>
                  FOR QUERIES OR ASSISTANCE
                </div>
                <div className={styles.queriesInfo}>
                  <a
                    href="mailto:customercare@goodearth.in"
                    className={styles.queriesInfo}
                  >
                    customercare@goodearth.in
                  </a>
                </div>
                <div className={styles.queriesInfo}>
                  <a
                    href="tel:(+91 95829 99555)"
                    className={styles.queriesInfo}
                  >
                    +91 95829 99555
                  </a>{" "}
                  /{" "}
                  <a
                    href="tel:(+91 95829 99888)"
                    className={styles.queriesInfo}
                  >
                    +91 95829 99888
                  </a>
                </div>
                <div className={styles.queriesInfo}>Mon- Sat | 9am-5pm IST</div>
              </div>
            </div>
          </div>
        </div>
        {mobile && (
          <div
            id="show-preview"
            className={cs(styles.previewTrigger)}
            onClick={this.onSeePreviewClick}
          >
            <div className={cs(styles.carretContainer)}>
              <div className={cs(styles.carretUp)}></div>
            </div>
            <div className={cs(styles.text)}>See Gift Card Preview</div>
          </div>
        )}
        {(mobile || tablet) && (
          <div className={styles.buyNowCta}>
            <Button
              variant="mediumAquaCta366"
              onClick={this.onSubmit}
              label={"BUY NOW"}
              disabled={
                !(!formDisabled && selectedCountry != "" && cardId != "")
              }
              className={cs(globalStyles.btnFullWidth, styles.addToBag)}
            />
          </div>
        )}
        {(mobile || tablet) && (
          <div
            className={cs(styles.previewModal, { [styles.open]: previewOpen })}
          >
            <div
              className={styles.backToGcDetails}
              onClick={this.onBackToGcClick}
            >
              <div className={styles.text}>Back to Gift Card Details</div>
              <div className={styles.carretContainer}>
                <div className={styles.carretDown}></div>
              </div>
            </div>
            <div className={styles.title}>Preview</div>
            <div className={styles.imageContainer}>
              <img src={selectedImage} alt="giftcard preview" />
            </div>
            <div className={styles.salutation}>
              Dear {recipientName ? recipientName : `[Reciever's Name]`}
            </div>
            <div className={styles.staticMsg}>
              You have recieved a Good Earth eGift card worth
            </div>
            <div className={styles.gcAmount}>
              {String.fromCharCode(...currencyCharCode)}&nbsp;&nbsp;
              {cardValue ? cardValue : customValue}
            </div>
            <div className={styles.senderName}>
              From {senderName ? senderName : `[Sender's Name]`}
            </div>
            <div className={styles.theirMessage}>Their Message:</div>
            <div className={styles.message}>{message}</div>
            <div className={styles.theirMessage}>
              Apply this code during checkout :
            </div>
            <div className={styles.dummyCode}>
              <span>xxxxxx</span>
            </div>
            <div className={styles.note}>
              Please Note: All our gift cards are valid for a period of 11
              months from date of purchase.
            </div>
          </div>
        )}
      </div>
    );
  }
}

const gift = withRouter(NewGiftcard);
export default connect(mapStateToProps, mapDispatchToProps)(gift);
