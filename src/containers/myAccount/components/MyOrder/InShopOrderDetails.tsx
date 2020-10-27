import React, { useState, useEffect } from "react";
import moment from "moment";
import { ShopProps } from "./typings";
import AccountService from "services/account";
import { currencyCode } from "typings/currency";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import noPlpImage from "images/noimageplp.png";
import { useDispatch, useStore } from "react-redux";

const InShopOrderDetails: React.FC<ShopProps> = props => {
  const [shopdata, setShopData] = useState<any>({});
  const dispatch = useDispatch();
  const { mobile } = useStore().getState().device;
  // const history = useHistory();
  useEffect(() => {
    props.isLoading(true);
    AccountService.fetchshopOrderDetails(dispatch, props.data.number)
      .then((result: any) => {
        if (result != "error") {
          setShopData(result);
        }
        props.isLoading(false);
      })
      .catch(err => {
        props.isLoading(false);
        console.error("Axios Error: ", err);
      });
    return () => {
      props.hasShopped(false);
    };
  }, []);

  // const trackOrder = (e: React.MouseEvent) => {
  //   localStorage.setItem("orderNum", e.currentTarget.id);
  //   history.push("/account/track-order");
  //   // props.setAccountPage(e);
  // };

  const closeDetails = (orderNum?: string) => {
    props.closeDetails(-1, orderNum);
  };

  const openAddress = (data: any) => {
    const html = [],
      shippingAddress = data.shipping_address,
      billingAddress = data.billing_address;
    let totalItem = 0;
    if (!shopdata.order_lines) {
      return false;
    }
    for (let i = 0; i < shopdata.order_lines.length; i++) {
      totalItem += shopdata.order_lines[i].quantity;
    }
    html.push(
      <div className={bootstrapStyles.col12}>
        <div className={styles.add}>
          <address>
            <label>order # {shopdata.number}</label>
            <div className={cs(styles.orderBlock, bootstrapStyles.row)}>
              <div
                className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
              >
                <p>{moment(shopdata.order_date).format("MM,DD,YYYY")}</p>
                <p>
                  <span className={styles.op2}>Status</span>: &nbsp;
                  <span className={styles.orderStatus}>
                    {shopdata.total_quantity > 0 ? "Processed" : "Returned"}
                  </span>
                </p>
                <p>
                  <span className={styles.op2}>Items</span>: &nbsp;{totalItem}
                </p>
              </div>
              <div
                className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
              >
                <p>
                  <span className={styles.op2}>Order Total</span>
                </p>
                <p>
                  {String.fromCharCode(currencyCode["INR"])} &nbsp;
                  {shopdata.total}
                </p>
              </div>
              <p className={mobile ? styles.editMobile : styles.edit}>
                <a
                  className={globalStyles.cerise}
                  onClick={() => {
                    closeDetails(shopdata.number);
                  }}
                >
                  {" "}
                  close{" "}
                </a>
              </p>
            </div>
            <div className={cs(bootstrapStyles.row, styles.borderAdd)}>
              <div
                className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
              >
                <div className={styles.add}>
                  {shippingAddress ? (
                    <address>
                      <label>PURCHASED (SHOP)</label>
                      <p>
                        {"ECOM"}
                        <br />
                      </p>
                    </address>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div
                className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
              >
                <div className={styles.add}>
                  {billingAddress ? (
                    <address>
                      <label>billing address</label>
                      <p>
                        {billingAddress.first_name}
                        &nbsp; {billingAddress.last_name}
                        <br />
                      </p>
                      <p className={styles.light}>
                        {billingAddress.line1}
                        <br />
                        {billingAddress.line2} {billingAddress.line2 && <br />}
                        {billingAddress.state}, {billingAddress.postcode} <br />
                        {billingAddress.country_name}
                        <br />
                      </p>
                      <p> {billingAddress.phone_number}</p>
                    </address>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            {shopdata.order_lines.map((item: any) => {
              return (
                <div
                  className={cs(
                    bootstrapStyles.row,
                    styles.borderAdd,
                    globalStyles.voffset4
                  )}
                  key={item.sku}
                >
                  <div
                    className={cs(bootstrapStyles.col5, bootstrapStyles.colMd3)}
                  >
                    <img
                      src={noPlpImage}
                      className={globalStyles.imgResponsive}
                    />
                  </div>
                  <div
                    className={cs(bootstrapStyles.col7, bootstrapStyles.colMd9)}
                  >
                    <div className={cs(styles.imageContent, styles.textLeft)}>
                      <p className={cs(styles.productN, styles.itemPadding)}>
                        {item.title}
                      </p>
                      <p className={cs(styles.productN, styles.itemPadding)}>
                        {String.fromCharCode(currencyCode["INR"])}
                        &nbsp; {item.price}
                      </p>
                      <div className={styles.plp_prod_quantity}>
                        Qty:&nbsp; {item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className={styles.edit}>
              <a
                className={globalStyles.cerise}
                onClick={() => {
                  closeDetails(shopdata.number);
                }}
              >
                {" "}
                close{" "}
              </a>
            </div>
          </address>
        </div>
      </div>
    );
    return html;
  };
  return <>{openAddress(props.data)}</>;
};

export default InShopOrderDetails;
