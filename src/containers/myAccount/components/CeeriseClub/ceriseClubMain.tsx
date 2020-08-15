import React, { Component } from "react";
import StyledProgressbar from "./progressBar";
// import AddressMainComponent from 'components/common/address/addressMain';
// import axios from 'axios';
// import Config from "components/config";
import RewardsComponent from "./rewardsComponent";
import moment from "moment";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import { Dispatch } from "redux";

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  customerDetails: any;
  isLoading: boolean;
  customerUniqueID: string;
  addressAvailable: boolean;
  slab: string;
  next_slab_amount: string;
  points: number;
};

const mapStateToProps = (state: AppState) => {
  return {
    mobile: state.device.mobile
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

class CeriseClubMain extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      customerDetails: {},
      isLoading: false,
      customerUniqueID: "",
      addressAvailable: false,
      slab: "",
      next_slab_amount: ""
    };
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

  setAddressAvailable(addressAvailable) {
    this.setState({
      addressAvailable: addressAvailable
    });
  }

  componentDidMount() {
    this.getLoyaltyTransactions();
  }

  manageAddress() {
    location.href = "/accountpage?mod=address";
  }

  getLoyaltyTransactions() {
    const formData = new FormData();
    formData.append("email", window.user.email);
    formData.append("phoneno", "");
    axios
      .post(`${Config.hostname}mobiquest/showloyaltytransactions/`, formData)
      .then(res => {
        if (res.data.is_success) {
          this.setState({
            customerDetails: res.data.message.CUSTOMER_DETAILS[0],
            slab: res.data.message.CUSTOMER_DETAILS[0].Slab,
            expiryDate: moment(
              res.data.message.CUSTOMER_DETAILS[0].Expiry_date,
              "DD-MM-YYYY"
            ),
            points: res.data.message.CUSTOMER_DETAILS[0].Expiry_Points,
            memberExpiryDate: moment(
              res.data.message.CUSTOMER_DETAILS[0]["Member Expiry Date"],
              "DD-MM-YYYY"
            ),
            customerUniqueID: res.data.unique_id
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  viewStatementMicrosite() {
    location.href = `https://goodearthindia.mloyalretail.com/microsite/default.asp?cid=${this.state.customerUniqueID}`;
  }

  getLoader() {
    return (
      <span>
        <i className="fa fa-spinner fa-spin"></i>Loading
      </span>
    );
  }

  onClickManageProfile() {
    location.href = "/accountpage?mod=profile";
  }

  render() {
    let club;
    let percentage;
    let nextSlab;
    if (this.state.slab) {
      club =
        this.state.slab.toLowerCase() == "cerise" ||
        this.state.slab.toLowerCase() == "ff10"
          ? "Cerise"
          : "Cerise Sitara";
      percentage =
        this.state.slab.toLowerCase() == "cerise" ||
        this.state.slab.toLowerCase() == "ff10"
          ? this.state.customerDetails.PurchaseAmount / 5000
          : 100;
      nextSlab =
        this.state.slab.toLowerCase() == "cerise"
          ? "Cerise Sitara"
          : "Cerise Sitara";
    }
    const buttonText = this.state.addressAvailable
      ? "MANAGE ADDRESSES"
      : "ADD ADDRESS";
    const slabAmount =
      this.state.customerDetails.next_slab_amount == 0
        ? "0"
        : this.state.customerDetails.next_slab_amount
        ? this.state.customerDetails.next_slab_amount
        : this.state.customerDetails.next_slab_amount == 0 ||
          this.state.next_slab_amount == null
        ? "0"
        : "Loading...";
    return (
      <div className="cerise-club-main">
        <div className="cerise-main">
          <div className="cerise-header">
            <div className="customer-cerise-info">
              <div className="customer-welcome">
                <h4 className="op2">Welcome</h4>
                <p className="cerise member-name">
                  {this.state.customerDetails.Name}
                </p>
                <span className="op2">To {club}</span>
                <br />
                {!this.props.mobile && (
                  <button
                    onClick={this.onClickManageProfile}
                    className="cerise cerise-manage-profile"
                  >
                    Manage Profile
                  </button>
                )}
              </div>
              {!this.props.mobile ? (
                <div className="customer-points">
                  <div className="progress-bar">
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
                  <div className="customer-points-info">
                    {this.state.slab &&
                    (this.state.slab.toLowerCase() === "cerise" ||
                      this.state.slab.toLowerCase() == "ff10") ? (
                      <p>
                        Shop for &#x20b9; {slabAmount} to become a <br />
                        <strong className="link-text-underline">
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
                      className="cerise-btn"
                      onClick={this.viewStatementMicrosite}
                      value="View Statement"
                    />
                  </div>
                </div>
              ) : (
                <div className="customer-points">
                  <div className="customer-points-info">
                    {this.state.slab &&
                    (this.state.slab.toLowerCase() === "cerise" ||
                      this.state.slab.toLowerCase() == "ff10") ? (
                      <p>
                        Shop for &#x20b9; {slabAmount} to become a <br />
                        <strong className="link-text-underline">
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
                  <div className="progress-bar">
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
                      className="cerise cerise-manage-profile"
                    >
                      Manage Profile
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="cerise-redeem-info">
              {this.state.points > 0 && (
                <p className="">
                  {this.state.points}{" "}
                  <span className="op2">
                    Reward points are due to expire on
                  </span>{" "}
                  {moment(this.state.expiryDate).format("DD")}{" "}
                  {
                    this.months[
                      parseInt(moment(this.state.expiryDate).format("MM")) - 1
                    ]
                  }
                  , {moment(this.state.expiryDate).format("YYYY")}.{" "}
                  <strong className="cursor-pointer link-text-underline">
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
              <div className="customer-points-info">
                <input
                  onClick={this.viewStatementMicrosite}
                  type="button"
                  className="cerise-btn"
                  value="View Statement"
                />
              </div>
            )}
          </div>
          <div className="cerise-rewards-main">
            {this.state.slab && <RewardsComponent slab={this.state.slab} />}
          </div>
          <div className="cerise-address-main">
            <div className="cerise-address-component">
              <h4 className="cerise">My Address</h4>
              <AddressMainComponent
                showDefaultAddressOnly={true}
                currentCallBackComponent="cerise"
                setAddressAvailable={this.setAddressAvailable}
              />
            </div>
            {!this.state.addressAvailable && (
              <p className="op2 loyalty-info-text">
                Add a default mailing address for us to send you Cerise related
                communication.
              </p>
            )}
            <div className="manage-address-btn">
              <input
                type="button"
                className="cerise-btn"
                onClick={this.manageAddress}
                value={buttonText}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CeriseClubMain);
