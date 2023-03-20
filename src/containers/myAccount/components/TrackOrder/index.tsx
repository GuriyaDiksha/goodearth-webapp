import React, { RefObject } from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import FormInput from "../../../../components/Formsy/FormInput";
import Formsy from "formsy-react";
import { TrackOrderProps, State } from "./typings";
import TrackDetails from "./trackOrderDetail";
import mapDispatchToProps from "../MyOrder/mapper/actions";
import { AppState } from "reducers/typings";
import Loader from "components/Loader";
import { withRouter, RouteComponentProps } from "react-router";
import { errorTracking } from "utils/validate";

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user,
    mobile: state.device.mobile
  };
};
type Props = TrackOrderProps &
  RouteComponentProps &
  ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

class TrackOrder extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    props.setCurrentSection();
    this.state = {
      showerror: "",
      updateSubmit: false,
      orderData: {},
      trackingData: {},
      showTracking: false,
      loader: false,
      orderNumber: "",
      myemail: ""
    };
  }

  TrackOrderFormRef: RefObject<Formsy> = React.createRef();
  emailInput: RefObject<HTMLInputElement> = React.createRef();
  //   TrackOrderFormRef: RefObject<Formsy> = React.createRef();

  componentDidMount() {
    const orderid = localStorage.getItem("orderNum");
    if (this.props.user.email && orderid) {
      this.setState({ loader: true });
      this.sendTrackOrder(orderid, this.props.user.email);
      localStorage.setItem("orderNum", "");
      this.setState({
        orderNumber: orderid
      });
    }
    // code for load by email
    const queryString = this.props.location.search;
    const urlParams = new URLSearchParams(queryString);
    const order = urlParams.get("orderno");
    if (order) {
      this.setState({ loader: true });
      if (this.props.user.email) {
        this.sendTrackOrder(order, this.props.user.email);
        this.setState({
          orderNumber: order,
          myemail: this.props.user.email
        });
      } else {
        this.props
          .fetchEmailbyOrder(order)
          .then((newemail: any) => {
            this.sendTrackOrder(order, newemail.email);
            this.setState({
              orderNumber: order,
              myemail: newemail.email
            });
          })
          .catch(err => {
            this.setState({
              loader: false
            });
          });
      }
    }
  }

  sendTrackOrder(orderNumber: string, email: string) {
    this.props
      .fetchOrderBy(orderNumber, email)
      .then((response: any) => {
        if (response.count == 0) {
          // resetForm();
          const err = "Entered Order Number doesn't exist. Please try again.";
          this.setState(
            {
              showerror: err,
              loader: false
            },
            () => {
              errorTracking([this.state.showerror], location.href);
            }
          );
        } else if (response.results[0]?.isOnlyGiftOrder) {
          const err =
            "E-gift card has been sent to the recipient's email address.";
          this.setState(
            {
              showerror: err,
              loader: false
            },
            () => {
              errorTracking([this.state.showerror], location.href);
            }
          );
        } else if (response.count > 0) {
          this.props
            .fetchCourierData(orderNumber)
            .then(data => {
              if (data == "error") {
                const err =
                  "Please retry in some time, unable to fetch order details at this time.";
                this.setState(
                  {
                    showerror: err,
                    loader: false
                  },
                  () => {
                    errorTracking([this.state.showerror], location.href);
                  }
                );
              } else {
                this.setState({
                  trackingData: data,
                  orderData: response.results,
                  showTracking: true,
                  loader: false
                });
              }
            })
            .catch(err => {
              const errmsg =
                "Please retry in some time, unable to fetch order details at this time.";
              this.setState(
                {
                  showerror: errmsg,
                  loader: false
                },
                () => {
                  errorTracking([this.state.showerror], location.href);
                }
              );
              console.log(err);
            });
        }
      })
      .catch(err => {
        if (err.response.data.error_message) {
          let errorMsg = err.response.data.error_message[0];
          if (errorMsg == "MaxRetries") {
            errorMsg =
              "You have exceeded max attempts, please try after some time.";
          }
          this.setState(
            {
              showerror: errorMsg,
              loader: false
            },
            () => {
              errorTracking([this.state.showerror as string], location.href);
            }
          );
        } else {
          const errMsg =
            "Please retry in some time, unable to fetch order details at this time.";
          this.setState(
            {
              showerror: errMsg,
              loader: false
            },
            () => {
              errorTracking([this.state.showerror], location.href);
            }
          );
          console.log(err);
        }
      });

    //--------Uncomment to get data for development-----------//
    // this.setState({
    //   trackingData: {
    //     order_statuses: [
    //       {
    //         location: "",
    //         date: "2022-09-06",
    //         status: "Order Received"
    //       },
    //       {
    //         location: "",
    //         date: "2022-09-06",
    //         status: "Ready to Pick"
    //       },
    //       {
    //         location: "Hyderabad_Kukatpally_D (Telangana)",
    //         date: "2022-09-18",
    //         status: "Delivered"
    //       },
    //       {
    //         location: "Hyderabad_Kukatpally_D (Telangana)",
    //         date: "2022-09-17",
    //         status: "Intransit"
    //       },
    //       {
    //         location: "Faridabad_Mthurard_CP (Haryana)",
    //         date: "2022-09-15",
    //         status: "Shipped"
    //       }
    //     ]
    //   },
    //   orderData: [
    //     {
    //       number: "23625216866",
    //       billingAddress: [
    //         {
    //           firstName: "Saumya",
    //           lastName: "Wardhan",
    //           line1:
    //             "Flat No. 23, Unique Apartments, Sector-13, Rohini, New Delhi",
    //           line2: "23, Unique Apartments",
    //           line3: "saumyawardhan@goodearth.in",
    //           line4: "North Delhi",
    //           phoneNumber: "+2972867654",
    //           postcode: "000000",
    //           searchText:
    //             "Saumya Wardhan Flat No. 23, Unique Apartments, Sector-13, Rohini, New Delhi 23, Unique Apartments saumyawardhan@goodearth.in North Delhi 000000",
    //           state: "",
    //           title: "",
    //           countryName: "Aruba"
    //         }
    //       ],
    //       lines: [
    //         {
    //           product: {
    //             getAbsoluteUrl:
    //               "/catalogue/abeer-subbooh-collared-cotton-kurta_21323/",
    //             productClass: null,
    //             pricerecords: {
    //               SGD: 252,
    //               AED: 685,
    //               USD: 185,
    //               INR: 9500,
    //               GBP: 130
    //             },
    //             stockrecords: [
    //               {
    //                 partnerSku: "I00201646",
    //                 product: 21324,
    //                 numInStock: 0,
    //                 numAllocated: 0,
    //                 partner: 2
    //               }
    //             ],
    //             collection: "",
    //             details: "",
    //             compncare: null,
    //             sku: "I00201646",
    //             isInWishlist: false,
    //             id: 21324,
    //             title: "",
    //             structure: "child",
    //             images: [
    //               {
    //                 id: 532985,
    //                 productImage:
    //                   "https://d3qn6cjsz7zlnp.cloudfront.net/media/images/product/Medium/I00201646-1603957028.jpg",
    //                 caption: "",
    //                 displayOrder: 0,
    //                 dateCreated: "2021-05-24T12:02:12.280023Z",
    //                 social: true,
    //                 product: 21323,
    //                 badgeImage: "",
    //                 badgeImagePdp: "",
    //                 icon: false,
    //                 code: "",
    //                 looks_tagged: false,
    //                 type: "main"
    //               }
    //             ],
    //             size: "S",
    //             badgeType: "",
    //             categories: [
    //               "Apparel",
    //               "Apparel > Sale",
    //               "Apparel > Sustain Man",
    //               "Apparel > Sustain Man > Kurtas"
    //             ]
    //           },
    //           stockrecord: 25636,
    //           quantity: 1,
    //           priceCurrency: "USD",
    //           priceExclTax: "185.00",
    //           priceInclTax: "185.00",
    //           priceInclTaxExclDiscounts: "185.00",
    //           priceExclTaxExclDiscounts: "185.00",
    //           order: 102138,
    //           title: "Marrakech Subbooh Collared Cotton Kurta",
    //           fillerMessage: "",
    //           isEgiftCard: false,
    //           egiftCardRecipient: "",
    //           collection: "",
    //           is3DView: false
    //         }
    //       ],
    //       currency: "USD",
    //       totalInclTax: "215",
    //       totalExclTax: "215",
    //       shippingInclTax: "30",
    //       shippingExclTax: "30",
    //       shippingAddress: [
    //         {
    //           firstName: "Saumya",
    //           lastName: "Wardhan",
    //           line1:
    //             "Flat No. 23, Unique Apartments, Sector-13, Rohini, New Delhi",
    //           line2: "23, Unique Apartments",
    //           line3: "saumyawardhan@goodearth.in",
    //           line4: "North Delhi",
    //           phoneNumber: "+2972867654",
    //           postcode: "000000",
    //           searchText:
    //             "Saumya Wardhan Flat No. 23, Unique Apartments, Sector-13, Rohini, New Delhi 23, Unique Apartments saumyawardhan@goodearth.in North Delhi 000000",
    //           state: "",
    //           title: "",
    //           countryName: "Aruba",
    //           isTulsi: false
    //         }
    //       ],
    //       shippingMethod: "Weighted Shipping International",
    //       shippingCode: "WSI",
    //       status: "Being Processed",
    //       guestEmail: "",
    //       datePlaced: "2022-11-04T07:40:54.699258Z",
    //       offerDiscounts: [],
    //       paymentUrl:
    //         "You need to implement a view named 'api-payment' which redirects to the payment provider and sets up the callbacks.",
    //       voucherDiscounts: [],
    //       isBridalOrder: false,
    //       isOnlyGiftOrder: false,
    //       registrantName: "",
    //       coRegistrantName: "",
    //       occasion: "",
    //       pushToGA: false,
    //       deliveryInstructions: "",
    //       voucherCodeApplied: false,
    //       voucherCodeAppliedName: [],
    //       voucherCodeAppliedAmount: [],
    //       loyalityPointsRedeemed: [],
    //       giftVoucherRedeemed: [],
    //       invoiceFileName: "",
    //       paymentMethod: "PAYU",
    //       transactionId: "30e18dcce87f4dd4ae91e02be",
    //       orderSubTotal: 185
    //     }
    //   ],
    //   showTracking: true,
    //   loader: false
    // });
  }

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    const { email, orderNumber } = model;
    this.setState({ loader: true });
    this.sendTrackOrder(orderNumber, email);
  };

  handleValid = () => {
    this.setState({
      updateSubmit: true
    });
  };

  handleInvalid = () => {
    if (this.state.updateSubmit == true) {
      this.setState({ updateSubmit: false });
    }
  };

  errorOnBlur = (event: React.FocusEvent<Element>) => {
    const elem = event.currentTarget as HTMLInputElement;
    const value = elem.value;
    const name = elem.name;

    if (!value) {
      this.TrackOrderFormRef.current &&
        this.TrackOrderFormRef.current.updateInputsWithValue(
          {
            [name]: ""
          },
          true
        );
    }
  };

  loginForms = () => {
    const { updateSubmit } = this.state;
    const {
      user: { email, isLoggedIn }
    } = this.props;
    return (
      <div
        className={cs(
          styles.loginForm,
          globalStyles.voffset4,
          styles.marginFix
        )}
      >
        <div>
          <Formsy
            ref={this.TrackOrderFormRef}
            onValidSubmit={this.handleSubmit}
            onValid={this.handleValid}
            onInvalid={this.handleInvalid}
          >
            <div className={styles.categorylabel}>
              <div>
                <FormInput
                  name="orderNumber"
                  placeholder={"Order Number*"}
                  label={"Order Number"}
                  value={this.state.orderNumber}
                  keyUp={e => {
                    if (e.key == "Enter") {
                      e.preventDefault();
                    } else if (this.state.showerror) {
                      this.setState({ showerror: "" });
                    }
                  }}
                  handleChange={e => {
                    if (e.target.value == "") {
                      this.setState({ showerror: "" });
                    }
                  }}
                  blur={e => this.errorOnBlur(e)}
                  required
                />
              </div>

              <div>
                <FormInput
                  name="email"
                  placeholder={"Email*"}
                  label={"Email*"}
                  value={
                    isLoggedIn
                      ? email
                      : this.state.myemail
                      ? this.state.myemail
                      : ""
                  }
                  keyUp={e => {
                    if (e.key == "Enter") {
                      e.preventDefault();
                    } else if (this.state.showerror) {
                      this.setState({ showerror: "" });
                    }
                  }}
                  blur={e => this.errorOnBlur(e)}
                  inputRef={this.emailInput}
                  validations={{
                    isEmail: true,
                    maxLength: 75
                  }}
                  validationErrors={{
                    isEmail: "Please enter a valid Email ID",
                    maxLength:
                      "You are allowed to enter upto 75 characters only"
                  }}
                  disable={isLoggedIn ? true : false}
                  className={isLoggedIn ? styles.disabledInput : ""}
                  required
                />
              </div>
              <div>
                {this.state.showerror ? (
                  <p className={cs(styles.ctaError)}>{this.state.showerror}</p>
                ) : (
                  ""
                )}
                <input
                  type="submit"
                  disabled={!updateSubmit}
                  className={cs(styles.charcoalBtn, {
                    [styles.disabledBtn]: !updateSubmit
                  })}
                  value={"CHECK ORDER STATUS"}
                />
              </div>
            </div>
          </Formsy>
        </div>
      </div>
    );
  };

  backOrder = () => {
    const { history } = this.props;
    if (this.props.user.isLoggedIn) {
      history.push("/account/my-orders");
    } else {
      this.setState({
        showTracking: false
      });
    }
  };

  render() {
    const { showTracking, loader } = this.state;
    return (
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colLg12
          )}
        >
          {showTracking && (
            <div
              className={styles.backTrack}
              data-name="orders"
              onClick={this.backOrder}
            >
              &lt; BACK TO ORDERS
            </div>
          )}
          <div className={bootstrapStyles.row}>
            <div
              className={cs(bootstrapStyles.col10, {
                [bootstrapStyles.col12]: this.props.mobile
              })}
            >
              <div className={styles.formHeading}>Track Order</div>
              <div className={cs(styles.formSubheading, styles.trackOrder)}>
                {!showTracking
                  ? `Enter tracking number to track shipments and get delivery
                status.`
                  : `Track your orders to get shipments and delivery status`}
              </div>
              {!showTracking && this.loginForms()}
              {showTracking && (
                <TrackDetails
                  orderData={this.state.orderData}
                  trackingData={this.state.trackingData}
                  mobile={this.props.mobile}
                />
              )}
            </div>
          </div>
          {loader && <Loader />}
        </div>
      </div>
    );
  }
}
const Track = withRouter(TrackOrder);
export default connect(mapStateToProps, mapDispatchToProps)(Track);
