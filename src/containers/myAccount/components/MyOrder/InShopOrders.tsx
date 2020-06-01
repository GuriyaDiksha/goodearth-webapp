import React, { Component } from "react";
import Config from "components/config";
import moment from "moment";
import InShopOrderDetails from "./inShopOrderDetails";

export default class InShopOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isOpenAddressIndex: -1,
      currency: window.currency,
      currency_code: {
        INR: 8377,
        USD: 36,
        GBP: 163
      }
    };
    this.closeAddress = this.closeAddress.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  componentDidMount() {
    fetch(
      `${Config.hostname2}customer_offline_orders/?email=${window.user.email}`,
      {
        method: "GET"
      }
    )
      .then(resp => resp.json())
      .then(response => {
        this.setState({
          data: response["data"].slice(0, 14),
          hasShopped: response["data"].length > 0
        });
      })
      .then(() => {
        this.props.hasShopped(this.state.hasShopped);
        this.props.isLoading(false);
      })
      .catch(err => {
        console.error("Axios Error: ", err);
      });
  }

  showDetails(index) {
    this.setState({
      isOpenAddressIndex: index
    });
  }

  closeDetails() {
    this.setState({
      isOpenAddressIndex: -1
    });
  }

  closeAddress(data, index) {
    const html = [];
    let isHide,
      order_data = new Date(data.date_placed),
      today_date = new Date("04-01-2019");
    isHide = order_data <= today_date;
    html.push(
      <div className="col-xs-12">
        <div className="add">
          <address className="order-block">
            <label>order # {data.number}</label>
            <div className="row">
              <div className="col-xs-8">
                <p>{moment(data.date_placed).format("D MMM,YYYY")}</p>
                <p>
                  <span className="op2">Status</span>: &nbsp;{" "}
                  <span className="order-status">
                    {data.quantity > 0 ? "Processed" : "Returned"}
                  </span>
                </p>
                <p>
                  <span className="op2"> Items:</span> &nbsp; {data.quantity}
                </p>
              </div>
              <div className="col-xs-4">
                <p>
                  <span className="op2">Order Total</span>
                </p>
                <p className="bold price">
                  {String.fromCharCode(this.state.currency_code["INR"])}
                  &nbsp;{data.total}
                </p>
              </div>
            </div>
            <p className="edit">
              <a
                className={isHide ? "disabled-anchor" : "cerise"}
                onClick={() => {
                  isHide ? "" : this.showDetails(index);
                }}
              >
                {" "}
                view{" "}
              </a>
            </p>
          </address>
        </div>
      </div>
    );
    return html;
  }

  render() {
    return (
      <div className="in-shop-orders">
        {this.state.data.map((data, i) => {
          return (
            <div className="row voffset4">
              {this.state.isOpenAddressIndex == i ? (
                <InShopOrderDetails
                  order={data}
                  closeDetails={this.closeDetails.bind(this, i)}
                />
              ) : (
                this.closeAddress(data, i)
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
