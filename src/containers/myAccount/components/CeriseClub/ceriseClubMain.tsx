import React, { Component } from "react";
import StyledProgressbar from "./progressBar";
// import AddressMain from "components/Address/AddressMain";
import RewardsComponent from "./rewardsComponent";
import moment from "moment";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styles from "./styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import AccountServices from "services/account";
import { withRouter, RouteComponentProps } from "react-router-dom";

const mapStateToProps = (state: AppState) => {
  return {
    mobile: state.device.mobile,
    email: state.user.email,
    addressList: state.address.addressList
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getLoyaltyTransactions: async (formData: any) => {
      const res = await AccountServices.getLoyaltyTransactions(
        dispatch,
        formData
      );
      return res;
    }
  };
};

type Props = { setCurrentSection: () => void } & ReturnType<
  typeof mapStateToProps
> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

type State = {
  customerDetails: any;
  isLoading: boolean;
  customerUniqueID: string;
  addressAvailable: boolean;
  slab: string;
  nextSlabAmount: string;
  points: number;
  expiryDate: string;
  memberExpiryDate: string;
};

class CeriseClubMain extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      customerDetails: {},
      isLoading: false,
      customerUniqueID: "",
      addressAvailable: false,
      slab: "cerise",
      nextSlabAmount: "",
      points: 0,
      expiryDate: "",
      memberExpiryDate: ""
    };
    props.setCurrentSection();
  }
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  componentDidMount() {
    this.getLoyaltyTransactions();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.addressList && this.props.addressList.length > 0)
      this.setState({
        addressAvailable: true
      });
  }
  manageAddress = () => {
    this.props.history.push("/account/address");
  };

  getLoyaltyTransactions = () => {
    const formData = new FormData();
    formData.append("email", this.props.email);
    formData.append("phoneno", "");
    this.props
      .getLoyaltyTransactions(formData)
      .then((data: any) => {
        if (data.is_success) {
          this.setState({
            customerDetails: data.message.CUSTOMER_DETAILS[0],
            slab: data.message.CUSTOMER_DETAILS[0].Slab,
            expiryDate: moment(
              data.message.CUSTOMER_DETAILS[0].Expiry_date,
              "DD-MM-YYYY"
            ).toString(),
            points: data.message.CUSTOMER_DETAILS[0].Expiry_Points,
            memberExpiryDate: moment(
              data.message.CUSTOMER_DETAILS[0]["Member Expiry Date"],
              "DD-MM-YYYY"
            ).toString(),
            customerUniqueID: data.uniqueId
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  viewStatementMicrosite = () => {
    location.href = `https://goodearthindia.mloyalretail.com/microsite/default.asp?cid=${this.state.customerUniqueID}`;
  };

  getLoader() {
    return (
      <span>
        <i className="fa fa-spinner fa-spin"></i>Loading
      </span>
    );
  }

  onClickManageProfile = () => {
    // location.href = "/accountpage?mod=profile";
    this.props.history.push("/account/profile");
  };

  render() {
    const {
      slab,
      customerDetails: { PurchaseAmount, nextSlabAmount }
    } = this.state;
    let club;
    let percentage;
    let nextSlab;
    if (slab) {
      club =
        slab.toLowerCase() == "cerise" || slab.toLowerCase() == "ff10"
          ? "Cerise"
          : "Cerise Sitara";
      percentage =
        slab.toLowerCase() == "cerise" || slab.toLowerCase() == "ff10"
          ? PurchaseAmount / 5000
          : 100;
      nextSlab =
        slab.toLowerCase() == "cerise" ? "Cerise Sitara" : "Cerise Sitara";
    }
    // const buttonText = this.state.addressAvailable
    //   ? "MANAGE ADDRESSES"
    //   : "ADD ADDRESS";
    const slabAmount =
      nextSlabAmount == 0
        ? "0"
        : nextSlabAmount
        ? nextSlabAmount
        : nextSlabAmount == 0 || this.state.nextSlabAmount == null
        ? "0"
        : "Loading...";
    return (
      <div className={cs(styles.ceriseClubMain, bootstrapStyles.col12)}>
        <div className={styles.ceriseMain}>
          <div className={styles.ceriseHeader}>
            <div className={styles.customerCeriseInfo}>
              <div className={styles.customerWelcome}>
                <h4 className={globalStyles.op2}>Welcome</h4>
                <p className={cs(globalStyles.cerise, styles.memberName)}>
                  {this.state.customerDetails.Name}
                </p>
                <span className={globalStyles.op2}>To {club}</span>
                <br />
                {!this.props.mobile && (
                  <button
                    onClick={this.onClickManageProfile}
                    className={cs(
                      globalStyles.cerise,
                      styles.ceriseManageProfile
                    )}
                  >
                    Manage Profile
                  </button>
                )}
              </div>
              {!this.props.mobile ? (
                <div className={styles.customerPoints}>
                  <div className={styles.progressBar}>
                    <StyledProgressbar
                      percentage={percentage}
                      text={
                        this.state.customerDetails.LoyalityPoints
                          ? `${this.state.customerDetails.LoyalityPoints} Points`
                          : this.state.customerDetails.LoyalityPoints == 0
                          ? `0 Points`
                          : "Loading ..."
                      }
                    />
                  </div>
                  <div className={styles.customerPointsInfo}>
                    {this.state.slab &&
                    (this.state.slab.toLowerCase() === "cerise" ||
                      this.state.slab.toLowerCase() == "ff10") ? (
                      <p>
                        Shop for &#x20b9; {slabAmount} to become a <br />
                        <strong className={globalStyles.linkTextUnderline}>
                          {nextSlab || "Loading ..."}
                        </strong>{" "}
                        member.
                      </p>
                    ) : (
                      <p>
                        Your Cerise Sitara membership is valid till{" "}
                        {moment(this.state.memberExpiryDate).format("DD")}{" "}
                        {
                          this.months[
                            parseInt(
                              moment(this.state.memberExpiryDate).format("MM")
                            ) - 1
                          ]
                        }
                        , {moment(this.state.memberExpiryDate).format("YYYY")}.
                      </p>
                    )}
                    <input
                      type="button"
                      className={globalStyles.ceriseBtn}
                      onClick={this.viewStatementMicrosite}
                      value="View Statement"
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.customerPoints}>
                  <div className={styles.customerPointsInfo}>
                    {this.state.slab &&
                    (this.state.slab.toLowerCase() === "cerise" ||
                      this.state.slab.toLowerCase() == "ff10") ? (
                      <p>
                        Shop for &#x20b9; {slabAmount} to become a <br />
                        <strong className={globalStyles.linkTextUnderline}>
                          {nextSlab || "Loading ..."}
                        </strong>{" "}
                        member.
                      </p>
                    ) : (
                      <p>
                        Your Cerise Sitara membership is valid till{" "}
                        {moment(this.state.memberExpiryDate).format("DD")}{" "}
                        {
                          this.months[
                            parseInt(
                              moment(this.state.memberExpiryDate).format("MM")
                            ) - 1
                          ]
                        }
                        , {moment(this.state.memberExpiryDate).format("YYYY")}.
                      </p>
                    )}
                  </div>
                  <div className={styles.progressBar}>
                    <StyledProgressbar
                      percentage={percentage}
                      text={
                        this.state.customerDetails.LoyalityPoints
                          ? `${this.state.customerDetails.LoyalityPoints} Points`
                          : this.state.customerDetails.LoyalityPoints == 0
                          ? `0 Points`
                          : "Loading ..."
                      }
                    />
                  </div>
                  {this.props.mobile && (
                    <button
                      onClick={this.onClickManageProfile}
                      className={cs(
                        globalStyles.cerise,
                        styles.ceriseManageProfile
                      )}
                    >
                      Manage Profile
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className={styles.ceriseRedeemInfo}>
              {this.state.points > 0 && (
                <p className="">
                  {this.state.points}{" "}
                  <span className={globalStyles.op2}>
                    Reward points are due to expire on
                  </span>{" "}
                  {moment(this.state.expiryDate).format("DD")}{" "}
                  {
                    this.months[
                      parseInt(moment(this.state.expiryDate).format("MM")) - 1
                    ]
                  }
                  , {moment(this.state.expiryDate).format("YYYY")}.{" "}
                  <strong
                    className={cs(
                      globalStyles.pointer,
                      globalStyles.linkTextUnderline
                    )}
                  >
                    {" "}
                    <a href="/cart">Shop Now</a>
                  </strong>
                </p>
              )}
              {this.state.points == 0 && (
                <p className="">
                  Your Cerise Points are valid for one year from the date of
                  earn.
                </p>
              )}
            </div>
            {this.props.mobile && (
              <div className={styles.customerPointsInfo}>
                <input
                  onClick={this.viewStatementMicrosite}
                  type="button"
                  className={globalStyles.ceriseBtn}
                  value="View Statement"
                />
              </div>
            )}
          </div>
          <div className={styles.ceriseRewardsMain}>
            {this.state.slab && <RewardsComponent slab={this.state.slab} />}
          </div>
          {/* <div className={styles.ceriseAddressMain}>
            <div className={styles.ceriseAddressComponent}>
              <h4 className={globalStyles.cerise}>My Address</h4>
              <AddressMain
                isBridal={false}
                next={() => null}
                bridalId=""
                addresses={this.props.addressList}
                error=""
                addressType=""
                showDefaultAddressOnly={true}
                currentCallBackComponent="cerise"

              />
            </div>
            {!this.state.addressAvailable && (
              <p className={cs(globalStyles.op2, styles.loyaltyInfoText)}>
                Add a default mailing address for us to send you Cerise related
                communication.
              </p>
            )}
            <div className={styles.manageAddressBtn}>
              <input
                type="button"
                className={globalStyles.ceriseBtn}
                onClick={this.manageAddress}
                value={buttonText}
              />
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

const CeriseClubMainRoute = withRouter(CeriseClubMain);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CeriseClubMainRoute);
