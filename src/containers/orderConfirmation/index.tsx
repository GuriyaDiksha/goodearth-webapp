import React from "react";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import { Link } from "react-router-dom";

const orderConfirmation: React.FC<{}> = props => {
  const { mobile } = useSelector((state: AppState) => state.device);

  //const dispatch = useDispatch();
  console.log(mobile);

  return (
    <div>
      <div className={cs(bootstrapStyles.row, styles.subcHeader)}>
        <div className={cs(bootstrapStyles.col2, styles.logoContainer)}>
          <Link to="/">
            <img
              className={styles.logo}
              src={"/static/images/gelogoCerise.svg"}
            />
          </Link>
        </div>
      </div>

      <div className={cs(bootstrapStyles.row, styles.bgProfile, styles.os)}>
        <div
          className={cs(
            bootstrapStyles.col12,
            bootstrapStyles.colMd6,
            bootstrapStyles.offsetMd3,
            globalStyles.textCenter,
            styles.popupFormBg
          )}
        >
          <div className={styles.motif}>
            <img src={"media/misc/serai.png"} width="120px" />
          </div>

          <div className={bootstrapStyles.row}>
            <div
              className={cs(
                bootstrapStyles.col10,
                bootstrapStyles.offset1,
                bootstrapStyles.colMd8,
                bootstrapStyles.offsetMd2
              )}
            >
              <div className={styles.heading}>Order Confirmation</div>
              <div className={styles.subHeading}>
                Congratulations, Your order has been placed.
              </div>
            </div>
          </div>

          <div className={cs(bootstrapStyles.row, styles.white)}>
            <div
              className={cs(
                bootstrapStyles.col10,
                bootstrapStyles.offset1,
                bootstrapStyles.colMd8,
                bootstrapStyles.offsetMd2,
                globalStyles.voffset5
              )}
            >
              <div className={styles.add}>
                <address>
                  <label>order # 9290780223</label>
                  <div className={cs(bootstrapStyles.row, styles.orderBlock)}>
                    <div
                      className={cs(
                        bootstrapStyles.col12,
                        bootstrapStyles.colMd6
                      )}
                    >
                      <p>July 20, 2020</p>

                      <p>
                        <span className={globalStyles.op3}> Items: </span> 1
                      </p>
                    </div>
                    <div
                      className={cs(
                        bootstrapStyles.col12,
                        bootstrapStyles.colMd6
                      )}
                    >
                      <p>
                        <span className={globalStyles.op3}>Order Total</span>
                      </p>

                      <p>₹ 4987.00</p>
                    </div>
                  </div>

                  <div className={cs(bootstrapStyles.row, styles.borderAdd)}>
                    <div
                      className={cs(
                        bootstrapStyles.col12,
                        bootstrapStyles.colMd6
                      )}
                    >
                      <div className={styles.add}>
                        <address>
                          <label>shipping address</label>

                          <p>
                            Ajay &nbsp; <br />
                          </p>
                          <p className={styles.light}>
                            Hous No- A-105 Raju Park
                            <br />
                            Khanpur <br />
                            Saket -110030
                            <br />
                            Delhi <br />
                            India
                            <br />
                          </p>
                          <p> +91 75320 51001</p>
                        </address>
                      </div>
                    </div>

                    <div
                      className={cs(
                        bootstrapStyles.col12,
                        bootstrapStyles.colMd6
                      )}
                    >
                      <div className={styles.add}>
                        <address>
                          <label>billing address</label>
                          <p>
                            Ajay &nbsp; <br />
                          </p>
                          <p className={styles.light}>
                            Hous No- A-105 Raju Park
                            <br />
                            Khanpur <br />
                            Saket -110030 <br />
                            Delhi <br />
                            India
                            <br />
                          </p>
                          <p> +91 75320 51001</p>
                        </address>
                      </div>
                    </div>
                  </div>

                  <div
                    className={cs(
                      bootstrapStyles.row,
                      globalStyles.voffset2,
                      styles.borderAdd
                    )}
                  >
                    <div
                      className={cs(
                        bootstrapStyles.col5,
                        bootstrapStyles.colMd3
                      )}
                    >
                      <img
                        src="https://d3qn6cjsz7zlnp.cloudfront.net/media/images/product/Micro/I00147216-1540537640.jpg"
                        className="imgResponsive"
                      />
                    </div>
                    <div
                      className={cs(
                        bootstrapStyles.col7,
                        bootstrapStyles.colMd9
                      )}
                    >
                      <div
                        className={cs(
                          bootstrapStyles.imageContent,
                          globalStyles.textLeft
                        )}
                      >
                        <p className={cs(styles.productH)}></p>
                        <p className={cs(styles.productN)}>
                          Sindhu Water Copper Jug
                        </p>
                        <p className={cs(styles.productN)}>₹ 6000.00</p>
                        <div
                          className={cs(
                            styles.smallSize,
                            globalStyles.voffset2
                          )}
                        >
                          {`Size: 5.3" x 5.3" x7.8"`}
                        </div>
                        <div className={styles.smallSize}>Qty: 1</div>
                      </div>
                    </div>
                  </div>
                </address>
              </div>
            </div>
          </div>

          <div className={bootstrapStyles.row}>
            <div
              className={cs(
                bootstrapStyles.col12,
                bootstrapStyles.colMd8,
                bootstrapStyles.offsetMd2,
                styles.cta,
                globalStyles.voffset2,
                globalStyles.ceriseBtn
              )}
            >
              <div className={globalStyles.ceriseBtn}>
                <Link to={"/"}> continue shopping </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default orderConfirmation;
