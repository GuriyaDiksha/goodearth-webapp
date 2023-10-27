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
import AddressService from "services/address";
import { withRouter, RouteComponentProps } from "react-router-dom";
import AddressItem from "components/Address/AddressItem";
import { updateAddressList } from "actions/address";
import { updateMicroUrl } from "actions/info";
import ceriseMainlogo from "../../../../images/loyalty/ceriseMainlogo.svg";

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
    },
    fetchAddresList: () => {
      AddressService.fetchAddressList(dispatch).then(addressList => {
        dispatch(updateAddressList(addressList));
      });
    },
    updateMicroUrl: (url: string) => {
      dispatch(updateMicroUrl(url));
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
    this.props.fetchAddresList();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.addressList && nextProps.addressList.length > 0)
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
            customerDetails: data.message,
            slab: data.message.Slab,
            expiryDate: moment(
              data.message.Expiry_Date,
              "DD-MM-YYYY"
            ).toString(),
            points: data.message.Expiry_Points,
            memberExpiryDate: moment(
              data.message["Member Expiry Date"],
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
    const { updateMicroUrl, history } = this.props;
    updateMicroUrl(this.state.customerUniqueID);
    history.push("/microsite");
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
    const { slab, customerDetails } = this.state;
    const PurchaseAmount = customerDetails.PurchaseAmount;
    const nextSlabAmount = customerDetails.next_slab_amount;
    let club;
    let percentage;
    let nextSlab;
    if (slab) {
      club =
        slab.toLowerCase() == "cerise club" || slab.toLowerCase() == "ff10"
          ? "Cerise"
          : "Cerise Sitara";
      percentage =
        slab.toLowerCase() == "cerise" || slab.toLowerCase() == "ff10"
          ? PurchaseAmount / 5000
          : 100;
      nextSlab =
        slab.toLowerCase() == "cerise club" ? "Cerise Club" : "Cerise Sitara";
    }
    const buttonText = this.state.addressAvailable
      ? "MANAGE ADDRESSES"
      : "ADD ADDRESS";
    const slabAmount =
      nextSlabAmount == 0
        ? "0"
        : nextSlabAmount
        ? nextSlabAmount
        : nextSlabAmount == 0 || this.state.nextSlabAmount == ""
        ? "0"
        : "Loading...";
    const defaultAddressList = this.props.addressList.filter(
      address => address.isDefaultForShipping
    );
    // console.log('test')
    return (
      <div className={cs(styles.ceriseClubMain, bootstrapStyles.col12)}>
        {/* <div className={styles.ceriseMain}>
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
          <div className={styles.ceriseAddressMain}>
            <div className={styles.ceriseAddressComponent}>
              <h4 className={globalStyles.cerise}>My Address</h4>
              {this.state.addressAvailable && defaultAddressList.length > 0 && (
                <div className={styles.ceriseAddressItem}>
                  <AddressItem
                    addressData={defaultAddressList[0]}
                    index={0}
                    currentCallBackComponent="cerise"
                    isOnlyAddress={false}
                  />
                </div>
              )}
            </div>
            {(!this.state.addressAvailable ||
              defaultAddressList.length == 0) && (
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
          </div>
        </div> */}
        <div className={styles.ceriseMain}>
          <div className={styles.ceriseLogoWrapper}>
            <img
              src={ceriseMainlogo}
              alt="cerise-logo"
              className={styles.ceriseLogo}
            ></img>
          </div>
          <div className={styles.ceriseContentWrapper}>
            <div className={styles.cerisePreTitle}>
              <p>Cerise is going through a maintenance upgrade!</p>
            </div>
            <div className={styles.ceriseTitle}>
              <h3>We will be back soon.</h3>
            </div>
          </div>
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
