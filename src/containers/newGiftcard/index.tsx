import React from "react";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect, DispatchProp } from "react-redux";

import Formsy from "formsy-react";
import FormSelect from "../../components/Formsy/FormSelect";
import styles from "./styles.scss";
import mapDispatchToProps from "./mapper/actions";
import { Currency, currencyCode } from "typings/currency";
import * as util from "utils/validate";

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
  cardValue: string;
  code: number[];
  currency: Currency;
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
      cardValue: "",
      code: [],
      currency: props.currency
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
    return { code: currencyCode[nextProps.currency] };
  }

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
      cardValue,
      code
    } = this.state;
    console.log("Code: ", code);
    const { currency } = this.props;

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
                        this.setState({ cardValue: pro.id });
                      }}
                      data-value={pro.priceRecords[currency]}
                      className={cs({
                        [styles.selected]: cardValue == pro.id
                      })}
                      id={pro.id}
                    >
                      {String.fromCharCode(...code) +
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
            </div>
            {/* 4.E-Gift Card Details */}
            <div className={styles.eGiftCardDetails}>
              <div className={styles.sectionTitle}></div>
            </div>
            {/* 5. Add to Bag */}
            {/* 6. Terms and Conditions */}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewGiftcard);
