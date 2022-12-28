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

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    device: state.device,
    saleTimer: state.info.showTimer
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  DispatchProp;

type State = {
  giftImages: string[];
  selectedImage: string;
  productData: any;
  countryData: any;
  selectedCountry: string;
  sku: string;
  cardId: string;
  cardValue: string;
  currencyCode: number[];
  currency: Currency;
  recipientName: string;
  recipientEmail: string;
  confirmRecipientEmail: string;
  message: string;
  senderName: string;
  englishandSpace: RegExp;
  subscribe: boolean;
};

class NewGiftcard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      giftImages: [
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/gc1.png",
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/gc2.png",
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/gc3.png"
      ],
      selectedImage:
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/gc1.png",
      productData: [],
      countryData: [],
      selectedCountry: "",
      sku: "I00121125",
      cardId: "",
      cardValue: "",
      currencyCode: [],
      currency: props.currency,
      recipientName: "",
      recipientEmail: "",
      confirmRecipientEmail: "",
      message: "",
      senderName: "",
      englishandSpace: /^[a-zA-Z\s]+$/,
      subscribe: false
    };
  }

  onImageClick = (img: string) => {
    this.setState({ selectedImage: img });
  };

  compare = (a: any, b: any) => {
    const { currency } = this.props;
    return (
      parseInt(b.priceRecords[currency]) - parseInt(a.priceRecords[currency])
    );
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    return { currencyCode: currencyCode[nextProps.currency] };
  }

  onCustomValueChange = (e: any) => {
    this.setState({
      cardId: "",
      cardValue: e.target.value
    });
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
      confirmRecipientEmail: ""
    });
  };

  onMessageChange = (e: any) => {
    this.setState({
      message: ""
    });
  };

  onSenderNameChange = (e: any) => {
    this.setState({
      senderName: ""
    });
  };

  onSubmit = (e: any) => {
    return null;
  };

  componentDidMount() {
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
      }
      newCountry &&
        this.setState({
          selectedCountry: newCountry
        });
    });
    util.pageViewGTM("GiftCard");
  }

  render(): React.ReactNode {
    const {
      giftImages,
      selectedImage,
      countryData,
      productData,
      selectedCountry,
      sku,
      cardId,
      cardValue,
      currencyCode,
      recipientName,
      englishandSpace,
      recipientEmail,
      confirmRecipientEmail,
      message,
      senderName,
      subscribe
    } = this.state;

    const { currency } = this.props;
    console.log(cardValue);
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
      >
        <div className={styles.container}>
          <div className={styles.previewGc}>Preview</div>
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
                      <img src={img} />
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
                    placeholder="Select Country"
                    options={list}
                    // handleChange={}
                    name="country"
                    validations={{
                      isExisty: true
                    }}
                    validationErrors={{
                      isExisty: "This field is required"
                    }}
                  />
                </Formsy>
              </div>
              <div className={styles.note}>
                Please note: Gift cards can only be redeemed in the currency
                they are bought in, so please choose the country based on your
                recipient’s addres
              </div>
            </div>
            {/* 3. Card Value */}
            <div className={styles.cardValue}>
              <div className={styles.sectionTitle}>Card Value</div>
              <div className={styles.pricesContainer}>
                {productData.sort(this.compare).map((pro: any) => {
                  return pro.sku != sku ? (
                    <div
                      key={pro.sku}
                      onClick={() => {
                        this.setState({ cardId: pro.id });
                      }}
                      data-value={pro.priceRecords[currency]}
                      className={cs({
                        [styles.selected]: cardId == pro.id
                      })}
                      id={pro.id}
                    >
                      {String.fromCharCode(...currencyCode) +
                        " " +
                        pro.priceRecords[currency]}
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
                  return pro.sku == sku ? (
                    <div className={styles.customValueInput} key={sku}>
                      <input
                        type="number"
                        id={pro.id}
                        placeholder="Enter Custom Value"
                        onChange={this.onCustomValueChange}
                        value={cardValue}
                        className={cs({ [styles.aquaBorder]: cardValue != "" })}
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
                        {String.fromCharCode(...currencyCode)}{" "}
                      </div>
                    </div>
                  ) : (
                    ""
                  );
                })}
              </form>
            </div>
            {/* 4.E-Gift Card Details */}
            <div className={styles.eGiftCardDetails}>
              <div className={styles.sectionTitle}>E-GIFT CARD DETAILS</div>
              <Formsy>
                <FormInput
                  name="recipientName"
                  placeholder={"Recipient's Name"}
                  label={"Recipient's Name *"}
                  value={recipientName}
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
                    equalsField: "The Email ID entered doesn't match"
                  }}
                  required
                />
                <FormTextArea
                  placeholder=""
                  maxLength={250}
                  name="message"
                  rows={5}
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
                ></FormTextArea>
                <div className={cs(styles.limit)}>
                  Character Limit:{" "}
                  {250 - (message.trim() == "" ? 0 : message.length)}
                </div>
                <FormInput
                  name="senderName"
                  placeholder={"Sender's Name"}
                  label={"Sender's Name *"}
                  value={senderName}
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
            <div className={cs(styles.addToBag, styles.active)}>
              <a onSubmit={this.onSubmit}>ADD TO BAG</a>
            </div>
            {/* 6. Contact Us */}
            <div className={styles.contactUs}>
              <div className={styles.querriesTitle}>
                FOR QUERRIES OR ASSISTANCE
              </div>
              <div className={styles.querriesInfo}>
                customercare@goodearth.in
              </div>
              <div className={styles.querriesInfo}>
                +91 95829 995555/ +91 95829 99888
              </div>
              <div className={styles.querriesInfo}>Mon- Sat | 9am-5pm IST</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewGiftcard);
