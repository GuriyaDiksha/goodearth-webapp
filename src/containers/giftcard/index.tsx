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
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentSection: "card",
      productData: [],
      countryData: [],
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
    });
  }

  setSelectedSection = () => {
    switch (this.state.currentSection) {
      case "card":
        // return <Section1 giftimages={this.state.giftimages} />;
        return (
          <Section2
            countryData={this.state.countryData}
            productData={this.state.productData}
            currency={this.props.currency}
            mobile={this.props.device.mobile}
          />
        );
      case "amount":
        // return <GiftCard2 data={this.state.giftdata} next={this.nextcard3.bind(this)} back={this.goPrevious.bind(this)} preData={this.state.giftid}/>
        break;
      case "form":
        // return <GiftCard3 next={this.nextcard4.bind(this)} back={this.goPrevious.bind(this)} preData={this.state.giftDetails}/>
        break;
      case "preview":
        // return <GiftCard4 data={this.state} notify={this.showNotify.bind(this)} back={this.goPrevious.bind(this)}/>
        break;
      default:
        return "";
    }
  };

  render() {
    const {
      device: { mobile }
    } = this.props;
    return (
      <div className={styles.pageBody}>
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
