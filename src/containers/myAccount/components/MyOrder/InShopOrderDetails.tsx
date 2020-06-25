import React, { Component } from "react";
// import axios from "axios";
import moment from "moment";
// import Config from "components/config";
import Loader from "components/Loader";
import { currencyCodes } from "constants/currency";

type Props = {
  closeDetails: (event: React.MouseEvent) => void;
};

type State = {
  order: any;
  orderDetails: any;
  isDetailAvailable: boolean;
  isLoading: boolean;
};

export default class InShopOrderDetails extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      order: props.order,
      orderDetails: {},
      isDetailAvailable: false,
      isLoading: true
    };
  }

  componentDidMount() {
    // fetch(
    //   `${Config.hostname2}order_detail_api/?number=${this.state.order.number}`,
    //   {
    //     method: "GET"
    //   }
    // )
    //   .then(resp => resp.json())
    //   .then(res => {
    //     this.setState({
    //       orderDetails: res["data"],
    //       isDetailAvailable: true,
    //       isLoading: false
    //     });
    //   });
  }

  render() {
    return (
      <div className="col-xs-12">
        {this.state.isLoading && <Loader />}
        <div className="add">
          <address>
            <label>order # {this.state.order.number}</label>
            <div className="row order-block">
              <div className="col-xs-12 col-md-6">
                <p>
                  {moment(this.state.order.date_placed).format("D MMM,YYYY")}
                </p>
                <p>
                  <span className="op2">Status</span>: &nbsp;
                  <span className="order-status">
                    {this.state.order.quantity > 0 ? "Processed" : "Returned"}
                  </span>
                </p>
                <p>
                  <span className="op2">Items</span>: &nbsp;{" "}
                  {this.state.order.quantity}&nbsp;
                </p>
              </div>
              <div className="col-xs-12 col-md-6">
                <p>
                  <span className="op2">Order Total</span>
                </p>
                <p>
                  {String.fromCharCode(currencyCodes["INR"])} &nbsp;
                  {this.state.order.total}
                </p>
              </div>
              <p className="edit">
                <a className="cerise" onClick={this.props.closeDetails}>
                  {" "}
                  close{" "}
                </a>
              </p>
            </div>
            <div className="row border-add">
              <div className="col-xs-12 col-md-6">
                <div className="add purchased-shop">
                  <address>
                    <label>Purchased (Shop)</label>
                    <p>
                      {this.state.isDetailAvailable &&
                      this.state.orderDetails.orderLines[0].store
                        ? this.state.orderDetails.orderLines[0].store
                        : "NOT AVAILABLE"}
                    </p>
                  </address>
                </div>
              </div>
              <div className="col-xs-12 col-md-6">
                <div className="add">
                  {this.state.order.billing_address.first_name ? (
                    <address>
                      <label>billing address</label>
                      <p>
                        {this.state.order.billing_address.first_name}
                        &nbsp; {this.state.order.billing_address.last_name}
                        <br />
                      </p>
                      <p className="light">
                        {this.state.order.billing_address.line1}
                        <br />
                        {this.state.order.billing_address.line2}{" "}
                        {this.state.order.billing_address.line2 && <br />}
                        {this.state.order.billing_address.state},{" "}
                        {this.state.order.billing_address.postcode} <br />
                        {this.state.order.billing_address.country_name}
                        <br />
                      </p>
                      <p> {this.state.order.billing_address.phone_number}</p>
                    </address>
                  ) : (
                    "NOT AVAILABLE"
                  )}
                </div>
              </div>
            </div>
            {this.state.isDetailAvailable &&
              this.state.orderDetails.orderLines.map((item: any) => {
                return (
                  <div key={item} className="row voffset4 border-add">
                    <div className="col-xs-5 col-sm-2 col-md-3">
                      <img
                        src="/static/img/nopictureicon.png"
                        alt="Image Not Available"
                        className="img-responsive"
                      />
                    </div>
                    <div className="col-xs-7 col-sm-10 col-md-9">
                      <div className="image-content text-left">
                        <div className="image-content text-left">
                          <p className="product-n item-padding">{item.title}</p>
                          <p className="product-n item-padding">
                            {String.fromCharCode(currencyCodes["INR"])}
                            &nbsp; {item.price}
                          </p>
                          {item.size ? (
                            <div className="plp_prod_quantity">
                              Size:&nbsp; {item.size}
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="plp_prod_quantity">
                            Qty:&nbsp; {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            <div className="edit">
              <a className="cerise" onClick={this.props.closeDetails}>
                {" "}
                close{" "}
              </a>
            </div>
          </address>
        </div>
      </div>
    );
  }
}
