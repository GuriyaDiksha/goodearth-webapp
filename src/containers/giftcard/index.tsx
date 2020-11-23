import React from "react";
import SecondaryHeader from "components/SecondaryHeader";
import initActionSearch from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect, DispatchProp } from "react-redux";
// import iconStyles from "../../styles/iconFonts.scss";
import styles from "./styles.scss";
// import globalStyles from "styles/global.scss";
import Section2 from "./section2";
import Section1 from "./section1";
import Section3 from "./section3";
import Section4 from "./section4";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import mapDispatchToProps from "./mapper/actions";

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    device: state.device
  };
};
type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  DispatchProp;

class GiftCard extends React.Component<
  Props,
  {
    currentSection: string;
    giftimages: string[];
    productData: any;
    countryData: any;
    finalData: any;
    selectedCountry: string;
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentSection: "card",
      selectedCountry: "",
      productData: [],
      countryData: [],
      finalData: {},
      giftimages: [
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/gc1.jpg",
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/gc2.jpg",
        "https://d3qn6cjsz7zlnp.cloudfront.net/media/giftcard/gc3.jpg"
      ]
    };
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
      }
      newCountry &&
        this.setState({
          selectedCountry: newCountry
        });
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.currency !== this.props.currency) {
      this.goback("amount");
      const newCurrency = this.state.countryData[this.state.selectedCountry];
      if (nextProps.currency != newCurrency) {
        let newCountry = this.state.selectedCountry;
        if (nextProps.currency == "INR") {
          newCountry = "India";
        } else if (nextProps.currency == "GBP") {
          newCountry = "United Kingdom";
        } else if (nextProps.currency == "AED") {
          newCountry = "United Arab Emirates";
        } else if (nextProps.currency == "USD") {
          newCountry = "";
        }
        this.setState({
          selectedCountry: newCountry
        });
      }
    }
  }

  goback = (section: string) => {
    this.setState({
      currentSection: section
    });
  };

  setData = (data: any, section: string) => {
    const giftCardData = this.state.finalData;
    if (section == "card") {
      giftCardData["imageUrl"] = data;
    } else if (section == "amount") {
      this.setState({
        selectedCountry: data.selectedCountry
      });
    }
    this.setState({
      finalData: giftCardData
    });
  };

  next = (data: any, section: string) => {
    const giftCardData = this.state.finalData;
    if (section == "amount") {
      giftCardData["imageUrl"] = data;
    } else if (section == "form") {
      giftCardData["customPrice"] = data.customPrice;
      giftCardData["productId"] = data.productId;
      this.setState({
        selectedCountry: data.selectedCountry
      });
    } else if (section == "preview") {
      giftCardData["message"] = data.message;
      giftCardData["recipientEmail"] = data.recipientEmail;
      giftCardData["recipientName"] = data.recipientName;
      giftCardData["senderName"] = data.senderName;
      giftCardData["quantity"] = 1;
    } else if (section == "card") {
      // giftCardData = {};
      let newCountry = "";
      if (this.props.currency == "INR") {
        newCountry = "India";
      } else if (this.props.currency == "GBP") {
        newCountry = "United Kingdom";
      } else if (this.props.currency == "AED") {
        newCountry = "United Arab Emirates";
      }
      this.setState({
        selectedCountry: newCountry
      });
    }
    this.setState({
      finalData: giftCardData,
      currentSection: section
    });
  };

  setSelectedSection = () => {
    switch (this.state.currentSection) {
      case "card":
        return (
          <Section1
            giftimages={this.state.giftimages}
            next={this.next}
            setData={this.setData}
            data={this.state.finalData}
          />
        );
      case "amount":
        return (
          <Section2
            selectedCountry={this.state.selectedCountry}
            countryData={this.state.countryData}
            productData={this.state.productData}
            data={this.state.finalData}
            mobile={this.props.device.mobile}
            currency={this.props.currency}
            next={this.next}
            goback={this.goback}
            setData={this.setData}
          />
        );
      case "form":
        return (
          <Section3
            data={this.state.finalData}
            currency={this.props.currency}
            mobile={this.props.device.mobile}
            next={this.next}
            goback={this.goback}
          />
        );
      case "preview":
        return (
          <Section4
            data={this.state.finalData}
            mobile={this.props.device.mobile}
            next={this.next}
            currency={this.props.currency}
            goback={this.goback}
          />
        );
      default:
        return "";
    }
  };

  render() {
    const {
      device: { mobile }
    } = this.props;
    return (
      <div className={cs(bootstrap.containerFluid, styles.pageBody)}>
        {!mobile && (
          <SecondaryHeader>
            <div className={cs(bootstrap.colMd12, bootstrap.offsetMd1)}>
              <span className={styles.heading}>GIFT CARDS</span>
            </div>
          </SecondaryHeader>
        )}
        <div>{this.setSelectedSection()}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GiftCard);
export { initActionSearch };
