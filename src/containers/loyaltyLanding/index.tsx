import React, { Component } from "react";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import ceriseMainlogo from "../../images/loyalty/ceriseMainlogo.svg";
import butterfly from "../../images/loyalty/animate-img/butterfly.png";
import flower4 from "../../images/loyalty/animate-img/flower4.png";
import midPoints from "../../images/loyalty/points/midPoints.svg";
import flower2 from "../../images/loyalty/animate-img/flower2.png";
import ceriseClub from "../../images/loyalty/ceriseClub.svg";
import ceriseSitaraLogoActive from "../../images/loyalty/ceriseSitaraLogoActive.svg";
import rewardPoints from "../..//images/loyalty/points/rewardPoints.svg";
import inShop from "../../images/loyalty/points/inShop.svg";
import redeem from "../../images/loyalty/points/redeem.svg";
import ps from "../../images/loyalty/points/ps.svg";
import styling from "../../images/loyalty/points/styling.svg";
import gifting from "../../images/loyalty/points/gifting.svg";
import invites from "../../images/loyalty/points/invites.svg";
import specialPreviews from "../../images/loyalty/points/specialPreviews.svg";
import list1 from "../../images/loyalty/howitworks/list1.svg";
import list2 from "../../images/loyalty/howitworks/list2.svg";
import list3 from "../../images/loyalty/howitworks/list3.svg";
import flower6 from "../../images/loyalty/animate-img/flower6.png";
import flower1 from "../../images/loyalty/animate-img/flower1.png";
import flower3 from "../../images/loyalty/animate-img/flower3.png";
import flower5 from "../../images/loyalty/animate-img/flower5.png";
import customerCare from "../../images/loyalty/points/customerCare.svg";
import SecondaryHeader from "components/SecondaryHeader";

const mapStateToProps = (state: AppState) => {
  return {
    mobile: state.device.mobile
  };
};

type Props = {} & ReturnType<typeof mapStateToProps>;

type State = {
  tabs: boolean;
  readMore2: boolean;
  readLess2: boolean;
  readMore1: boolean;
  readLess1: boolean;
  tabsClassFirst: boolean;
  tabsClassSec: boolean;
  showblock1: boolean;
  showblock2: boolean;
  showBlockLess1: boolean;
  showBlockLess2: boolean;
  showBlockMore1: boolean;
  showBlockMore2: boolean;
};

export default class LoyaltyLanding extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tabs: true,
      readMore2: true,
      readLess2: false,
      readMore1: true,
      readLess1: false,
      tabsClassFirst: true,
      tabsClassSec: false,
      showblock1: false,
      showblock2: false,
      showBlockLess1: false,
      showBlockLess2: false,
      showBlockMore1: false,
      showBlockMore2: false
    };
    this.checkInView = this.checkInView.bind(this);
    this.scroll = this.scroll.bind(this);
  }

  tabFirst() {
    this.setState({
      tabs: true,
      tabsClassFirst: true,
      tabsClassSec: false
    });
  }

  tabSec() {
    this.setState({
      tabs: false,
      tabsClassFirst: false,
      tabsClassSec: true
    });
  }

  showBlockMore1() {
    console.log("chk 1");
    this.setState({
      readMore1: false,
      readLess1: true,
      showblock1: true,
      showBlockLess1: false
    });
  }

  showBlockMore2() {
    console.log("chk 2");
    this.setState({
      readMore2: false,
      readLess2: true,
      showblock2: true,
      showBlockLess2: false
    });
  }

  showBlockLess1() {
    this.setState({
      readMore1: true,
      readLess1: false,
      showblock1: false,
      showBlockLess1: true
    });
  }

  showBlockLess2() {
    this.setState({
      readMore2: true,
      readLess2: false,
      showblock2: false,
      showBlockLess2: true
    });
  }

  componentDidMount() {
    window.addEventListener("scroll", this.scroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scroll);
  }

  checkInView(el: any) {
    const scroll = window.scrollY || window.pageYOffset;
    const boundsTop = el.getBoundingClientRect().top + scroll;

    const viewport = {
      top: scroll,
      bottom: scroll + window.innerHeight
    };

    const bounds = {
      top: boundsTop,
      bottom: boundsTop + el.clientHeight
    };

    return (
      (bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom) ||
      (bounds.top <= viewport.bottom && bounds.top >= viewport.top)
    );
  }

  scroll() {
    const ele3 = document.getElementById("ele3");
    const ele4 = document.getElementById("ele4");
    const ele7 = document.getElementById("ele7");
    const ele6 = document.getElementById("ele6");
    const ele8 = document.getElementById("ele8");

    if (ele3 && this.checkInView(ele3)) {
      ele3.classList.add("ele3");
    }
    if (ele4 && this.checkInView(ele4)) {
      ele4.classList.add("ele4");
    }
    if (ele6 && this.checkInView(ele6)) {
      ele6.classList.add("ele6");
    }
    if (ele7 && this.checkInView(ele7)) {
      ele7.classList.add("ele7");
    }
    if (ele8 && this.checkInView(ele8)) {
      ele8.classList.add("ele8");
    }
  }

  render() {
    return (
      <div>
        {this.props.mobile ? (
          <div className={styles.loyalty}>
            <div className={styles.commonSubheader}>
              <div
                className={cs(bootstrapStyles.col11, bootstrapStyles.offset1)}
              >
                <span className={styles.heading}> cerise program</span>
              </div>
            </div>
            <div
              className={cs(
                bootstrapStyles.row,
                styles.paddTop80,
                styles.basic
              )}
            >
              <div
                className={cs(
                  bootstrapStyles.col10,
                  bootstrapStyles.offset1,
                  globalStyles.textCenter
                )}
              >
                <img src={ceriseMainlogo} className={styles.imgLoyalty} />
                <div
                  className={cs(
                    globalStyles.txtNormal,
                    styles.txtBold,
                    globalStyles.voffset4
                  )}
                >
                  {" "}
                  FROM OUR HEARTS TO YOUR HOME
                </div>
                <div
                  className={cs(globalStyles.txtNormal, globalStyles.voffset4)}
                >
                  {" "}
                  You have supported us on our journey of over two decades to
                  bring joy in the everyday through design stories and craft
                  traditions rooted in Asia.
                </div>
                <div
                  className={cs(globalStyles.txtNormal, globalStyles.voffset2)}
                >
                  We are delighted to welcome you to Cerise Program as an
                  extended member of the Good Earth family to become a part of
                  our world and give us an opportunity to get to know you
                  better.
                </div>
              </div>
            </div>

            <div
              className={cs(bootstrapStyles.row, styles.basic, styles.dispFlex)}
            >
              <div
                className={cs(
                  bootstrapStyles.col4,
                  bootstrapStyles.offset1,
                  styles.bgAnimation,
                  styles.butterfly
                )}
              >
                <img src={butterfly} className={styles.imgResponsive} />
              </div>
              <div
                className={cs(
                  bootstrapStyles.col7,
                  styles.bgAnimation,
                  styles.flowerR1
                )}
              >
                <img src={flower4} className={styles.imgResponsive} />
              </div>
            </div>
            <div className={cs(bootstrapStyles.row, styles.basic)}>
              <div
                className={cs(
                  bootstrapStyles.col10,
                  bootstrapStyles.offset1,
                  bootstrapStyles.colMd6,
                  bootstrapStyles.offsetMd3,
                  globalStyles.textCenter
                )}
              >
                <div className={cs(styles.heading1, globalStyles.voffset6)}>
                  PROGRAM INTRODUCTION
                </div>
                <div
                  className={cs(globalStyles.txtNormal, globalStyles.voffset2)}
                >
                  Once you are naturally selected as a member of the Cerise
                  Program based on your purchase value in one year, you are
                  entitled to various privileges listed below. As soon as the
                  annual value of your purchase increases to touch the next
                  milestone, you become a member of Cerise Sitara with access to
                  unique Sitara privileges.
                </div>
              </div>
            </div>
            <div className={cs(bootstrapStyles.row, styles.basic)}>
              <div className={cs(bootstrapStyles.col12, globalStyles.voffset3)}>
                <img src={midPoints} className={styles.points} />
              </div>
              <div
                className={cs(
                  bootstrapStyles.col6,
                  styles.bgAnimation,
                  styles.flowerL2
                )}
              >
                <img src={flower2} className={styles.imgResponsive} />
              </div>
            </div>
            <div className={cs(bootstrapStyles.row, styles.basic)}>
              <div
                className={cs(
                  bootstrapStyles.col12,
                  bootstrapStyles.colMd8,
                  bootstrapStyles.offsetMd2,
                  globalStyles.textCenter
                )}
              >
                <div className={cs(styles.heading1, globalStyles.voffset4)}>
                  Rewards and Benefits
                </div>
                <div
                  className={cs(
                    styles.tabsCerise,
                    styles.marginrl20,
                    globalStyles.voffset3
                  )}
                >
                  <ul className={styles.tabs}>
                    <li
                      className={
                        this.state.tabsClassFirst
                          ? styles.active
                          : styles.inactive
                      }
                      onClick={this.tabFirst.bind(this)}
                    >
                      {this.state.tabs ? (
                        <img src={ceriseClub} width="80%" />
                      ) : (
                        <img
                          src={ceriseClub}
                          width="80%"
                          className={styles.grayimg}
                        />
                      )}{" "}
                    </li>
                    <li
                      className={
                        this.state.tabsClassSec
                          ? styles.active
                          : styles.inactive
                      }
                      onClick={this.tabSec.bind(this)}
                    >
                      {this.state.tabs ? (
                        <img
                          src={ceriseSitaraLogoActive}
                          width="80%"
                          className={styles.grayimg}
                        />
                      ) : (
                        <img src={ceriseSitaraLogoActive} width="80%" />
                      )}{" "}
                    </li>
                  </ul>

                  {this.state.tabs ? (
                    <div className={styles.tabContent}>
                      <ul>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={rewardPoints} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Earn Cerise Points
                                </span>{" "}
                                <br />
                                Get 10% of your purchase value credited back in
                                your Good Earth account as Reward Points.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={inShop} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  In-shop & Online
                                </span>{" "}
                                <br />
                                Reward points are credited against your in-store
                                and online purchases.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={redeem} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>Redeem</span>{" "}
                                <br />
                                Redeem reward points at any time, in all our
                                shops and online.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className={styles.disabled}>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src="/images/loyalty/points/specialPreviews.svg" />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span>Special Previews</span> <br />
                                Enjoy special previews of our new collections as
                                they launch.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className={styles.disabled}>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={ps} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span>Dedicated Personal Shopper</span> <br />
                                Get assistance by your Good Earth Personal
                                Shopper for a faster and more convenient
                                shopping experience.{" "}
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className={styles.disabled}>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={styling} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span>Styling by Appointment</span> <br />
                                Enjoy personal styling services twice a year for
                                our apparel brand Sustain.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className={styles.disabled}>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={gifting} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span>
                                  Exclusive Access to the Good Earth Gifting
                                  Concierge
                                </span>
                                <br />
                                Let our Gifting Concierge assist you with
                                choosing and sending the most perfect gifts.
                                Also, personalize them if you wish so!
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className={styles.disabled}>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={invites} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span>Good Earth Events</span> <br />
                                Get invited to Good Earth experiential events
                                curated by our founder.
                              </p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className={styles.tabContent}>
                      <ul>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={rewardPoints} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Earn Cerise Points
                                </span>{" "}
                                <br />
                                Get 15% of your purchase value credited back in
                                your Good Earth account as Reward Points.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={redeem} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>Redeem</span>{" "}
                                <br />
                                Redeem reward points at any time, in all our
                                shops and online.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={specialPreviews} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Special Previews
                                </span>{" "}
                                <br />
                                Enjoy special previews of our new collections as
                                they launch.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={ps} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Dedicated Personal Shopper
                                </span>
                                <br />
                                Get assistance by your Good Earth Personal
                                Shopper for a faster and more convenient
                                shopping experience.{" "}
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={styling} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Styling by Appointment
                                </span>
                                <br />
                                Enjoy personal styling services twice a year for
                                our apparel brand Sustain.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={gifting} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Exclusive Access to the Good Earth Gifting
                                  Concierge
                                </span>
                                <br />
                                Let our Gifting Concierge assist you with
                                choosing and sending the most perfect gifts.
                                Also, personalize them if you wish so!
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={invites} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Good Earth Events
                                </span>
                                <br />
                                Get invited to Good Earth experiential events
                                curated by our founder.
                              </p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={cs(bootstrapStyles.row, styles.basic)}>
              <div
                className={cs(
                  bootstrapStyles.col10,
                  bootstrapStyles.offset1,
                  globalStyles.textCenter
                )}
              >
                <div className={cs(styles.heading1, globalStyles.voffset2)}>
                  How it works
                </div>
                <div className={cs(styles.list, globalStyles.voffset3)}>
                  <ul>
                    <li>
                      <img src={list1} />
                      <div className={globalStyles.txtNormal}>
                        Shop in-store or online.
                      </div>
                    </li>
                    <li>
                      <img src={list2} />
                      <div className={globalStyles.txtNormal}>
                        Earn upto 15% of your purchase value as Cerise Points.
                      </div>
                      <a
                        href="javascript:void(0);"
                        className={
                          this.state.readMore1 ? "" : globalStyles.hidden
                        }
                        onClick={this.showBlockMore1.bind(this)}
                      >
                        Read More
                      </a>
                      <div
                        className={
                          this.state.showblock1
                            ? globalStyles.txtNormal
                            : cs(globalStyles.txtNormal, globalStyles.hidden)
                        }
                      >
                        For Cerise Club members, 10% of the purchase value and
                        for Cerise Sitara members, 15% of the purchase value
                        will be automatically credited to the member’s name as
                        reward points. Reward points are a credit in the
                        member’s account with us and can be redeemed on any
                        future purchase, online or in-store.
                      </div>
                      <a
                        href="javascript:void(0);"
                        className={
                          this.state.readLess1 ? "" : globalStyles.hidden
                        }
                        onClick={this.showBlockLess1.bind(this)}
                      >
                        Read Less
                      </a>
                    </li>
                    <li>
                      <img src={list3} />
                      <div className={globalStyles.txtNormal}>
                        {" "}
                        Redeem earned reward points on future online or in-store
                        purchases.
                      </div>
                      <a
                        href="javascript:void(0);"
                        className={
                          this.state.readMore2 ? "" : globalStyles.hidden
                        }
                        onClick={this.showBlockMore2.bind(this)}
                      >
                        Read More
                      </a>
                      <div
                        className={
                          this.state.showblock2
                            ? globalStyles.txtNormal
                            : cs(globalStyles.txtNormal, globalStyles.hidden)
                        }
                      >
                        When a member redeems the reward points in the next
                        purchase, the invoice value will automatically be
                        reduced by the amount you have as reward points. Once
                        this purchase is completed, 10% (for Cerise Club) or 15%
                        (for Cerise Sitara) of that final paid amount will be
                        credited again into the member’s account as reward
                        points to be used in the next purchase.
                      </div>
                      <a
                        href="javascript:void(0);"
                        className={
                          this.state.readLess2 ? "" : globalStyles.hidden
                        }
                        onClick={this.showBlockLess2.bind(this)}
                      >
                        Read Less
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className={cs(bootstrapStyles.row, styles.basic)}>
              <div className={globalStyles.voffset3}>
                <div
                  className={cs(
                    globalStyles.txtNormal,
                    globalStyles.textCenter
                  )}
                >
                  For further information, please refer to <br />{" "}
                  <a
                    href="/customer-assistance/terms"
                    target="_blank"
                    className={cs(globalStyles.cerise, styles.txtUnderline)}
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/customer-assistance/faq"
                    target="_blank"
                    className={cs(globalStyles.cerise, styles.txtUnderline)}
                  >
                    FAQs
                  </a>
                  .
                </div>
              </div>
            </div>
            <div className={cs(bootstrapStyles.row, styles.basic, styles.btm)}>
              <div
                className={cs(
                  bootstrapStyles.col6,
                  bootstrapStyles.offset3,
                  globalStyles.voffset6,
                  styles.bgAnimation,
                  styles.flowerR2,
                  styles.list
                )}
              >
                <img src={butterfly} className={styles.btfly} />
                <img src={flower6} className={styles.imgResponsive} />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.loyalty}>
            <div className="">
              <div
                className={cs(
                  styles.bgAnimation,
                  styles.butterfly,
                  styles.ele1
                )}
              >
                <img src={butterfly} className={styles.imgResponsive} />
              </div>
              {!this.props.mobile && (
                <div
                  className={cs(
                    styles.bgAnimation,
                    styles.flowerL1,
                    styles.ele2
                  )}
                >
                  <img src={flower1} className={styles.imgResponsive} />
                </div>
              )}
              <div
                className={cs(styles.bgAnimation, styles.flowerL2)}
                id="ele3"
              >
                <img src={flower2} className={styles.imgResponsive} />
              </div>
              {!this.props.mobile && (
                <div
                  className={cs(styles.bgAnimation, styles.flowerL3)}
                  id="ele4"
                >
                  <img src={flower3} className={styles.imgResponsive} />
                </div>
              )}
              {!this.props.mobile && (
                <div
                  className={cs(styles.bgAnimation, styles.flowerL4)}
                  id="ele7"
                >
                  <img src={flower1} className={styles.imgResponsive} />
                </div>
              )}
              <div
                className={cs(styles.bgAnimation, styles.flowerR1, styles.ele5)}
              >
                <img src={flower4} className={styles.imgResponsive} />
              </div>
              <div
                className={cs(styles.bgAnimation, styles.flowerR2)}
                id="ele6"
              >
                <img src={flower5} className={styles.imgResponsive} />
              </div>
              <div
                className={cs(styles.bgAnimation, styles.flowerR3)}
                id="ele8"
              >
                <img
                  src="/images/loyalty/animate-img/flower4.png"
                  className={styles.imgResponsive}
                />
              </div>
            </div>
            {/* <div className={styles.commonSubheader}>
              <div
                className={cs(bootstrapStyles.col11, bootstrapStyles.offset1)}
              >
                <span className={styles.heading}> cerise program</span>
              </div>
            </div> */}
            <SecondaryHeader>
              <div
                className={cs(
                  bootstrapStyles.colMd12,
                  bootstrapStyles.offsetMd1,
                  styles.header,
                  globalStyles.verticalMiddle
                )}
              >
                <div>
                  <span className={styles.heading}>Cerise Program</span>
                </div>
              </div>
            </SecondaryHeader>
            <div
              className={cs(
                bootstrapStyles.row,
                styles.paddTop80,
                styles.basic
              )}
            >
              <div
                className={cs(
                  bootstrapStyles.col10,
                  bootstrapStyles.offset1,
                  bootstrapStyles.colMd6,
                  bootstrapStyles.offsetMd3,
                  globalStyles.textCenter
                )}
              >
                <img src={ceriseMainlogo} className={styles.imgLoyalty} />
                <div
                  className={cs(
                    globalStyles.txtNormal,
                    styles.txtBold,
                    globalStyles.voffset4
                  )}
                >
                  {" "}
                  FROM OUR HEARTS TO YOUR HOME
                </div>
                <div
                  className={cs(globalStyles.txtNormal, globalStyles.voffset4)}
                >
                  {" "}
                  You have supported us on our journey of over two decades to
                  bring joy in the everyday through design stories and craft
                  traditions rooted in Asia.
                </div>
                <div
                  className={cs(globalStyles.txtNormal, globalStyles.voffset2)}
                >
                  We are delighted to welcome you to Cerise Program as an
                  extended member of the Good Earth family to become a part of
                  our world and give us an opportunity to get to know you
                  better.
                </div>

                <div className={cs(styles.heading1, globalStyles.voffset6)}>
                  PROGRAM INTRODUCTION
                </div>
                <div
                  className={cs(globalStyles.txtNormal, globalStyles.voffset2)}
                >
                  Once you are naturally selected as a member of the Cerise
                  Program based on your purchase value in one year, you are
                  entitled to various privileges listed below. As soon as the
                  annual value of your purchase increases to touch the next
                  milestone, you become a member of Cerise Sitara with access to
                  unique Sitara privileges.
                </div>
              </div>
            </div>
            <div className={cs(bootstrapStyles.row, styles.basic)}>
              <div
                className={cs(
                  bootstrapStyles.col12,
                  bootstrapStyles.colMd8,
                  bootstrapStyles.offsetMd2,
                  globalStyles.textCenter
                )}
              >
                <div className={globalStyles.voffset3}>
                  <img src={midPoints} className={styles.points} />
                </div>
                <div className={cs(styles.heading1, globalStyles.voffset4)}>
                  Rewards and Benefits
                </div>

                <div
                  className={cs(
                    styles.tabsCerise,
                    styles.marginrl20,
                    globalStyles.voffset3
                  )}
                >
                  <ul className={styles.tabs}>
                    <li
                      className={
                        this.state.tabsClassFirst
                          ? styles.active
                          : styles.inactive
                      }
                      onClick={this.tabFirst.bind(this)}
                    >
                      {this.state.tabs ? (
                        <img src={ceriseClub} width="50%" />
                      ) : (
                        <img
                          src={ceriseClub}
                          width="50%"
                          className={styles.grayimg}
                        />
                      )}
                    </li>
                    <li
                      className={
                        this.state.tabsClassSec
                          ? styles.active
                          : styles.inactive
                      }
                      onClick={this.tabSec.bind(this)}
                    >
                      {this.state.tabs ? (
                        <img
                          src={ceriseSitaraLogoActive}
                          width="50%"
                          className={styles.grayimg}
                        />
                      ) : (
                        <img src={ceriseSitaraLogoActive} width="50%" />
                      )}
                    </li>
                  </ul>

                  {this.state.tabs ? (
                    <div className={styles.tabContent}>
                      <ul>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={rewardPoints} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Earn Cerise Points
                                </span>{" "}
                                <br />
                                Get 10% of your purchase value credited into
                                your account as Cerise Points.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={redeem} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>Redeem</span>{" "}
                                <br />
                                Redeem your Cerise Points any time in-store or
                                online.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={specialPreviews} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Special Previews
                                </span>{" "}
                                <br />
                                Enjoy special previews of our new collections as
                                they launch.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={customerCare} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Dedicated Customer Care
                                </span>{" "}
                                <br />
                                Reach out to us on an exclusive number and email
                                id anytime you need assistance.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className={styles.disabled}>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={ps} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span>Dedicated Personal Shopper</span> <br />
                                Get assistance by your Good Earth Personal
                                Shopper for a faster and more convenient
                                shopping experience.{" "}
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className={styles.disabled}>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={styling} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span>Styling by Appointment</span> <br />
                                Enjoy personal styling services twice a year for
                                our apparel brand Sustain.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className={styles.disabled}>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src="/images/loyalty/points/gifting.svg" />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span>
                                  Exclusive Access to the Good Earth Gifting
                                  Concierge
                                </span>
                                <br />
                                Let our Gifting Concierge assist you with
                                choosing and sending the most perfect gifts.
                                Also, personalize them if you wish so!
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className={styles.disabled}>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={invites} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span>Good Earth Events</span> <br />
                                Get exclusive access to curated Good Earth
                                experiences celebrating the best in design,
                                fashion, and the arts.
                              </p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className={styles.tabContent}>
                      <ul>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={rewardPoints} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Earn Cerise Points
                                </span>{" "}
                                <br />
                                Get 15% of your purchase value credited into
                                your account as Cerise Points.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={redeem} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>Redeem</span>{" "}
                                <br />
                                Redeem your Cerise Points any time in-store or
                                online.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={specialPreviews} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Special Previews
                                </span>{" "}
                                <br />
                                Enjoy special previews of our new collections as
                                they launch
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={customerCare} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Dedicated Customer Care
                                </span>{" "}
                                <br />
                                Reach out to us on an exclusive number and email
                                id anytime you need assistance.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={ps} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Dedicated Personal Shopper
                                </span>
                                <br />
                                Get assistance by your Good Earth Personal
                                Shopper for a faster and more convenient
                                shopping experience.{" "}
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={styling} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Styling by Appointment
                                </span>
                                <br />
                                Enjoy personal styling services twice a year for
                                our apparel brand Sustain.
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={gifting} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Exclusive Access to the Good Earth Gifting
                                  Concierge
                                </span>
                                <br />
                                Let our Gifting Concierge assist you with
                                choosing and sending the most perfect gifts.
                                Also, personalize them if you wish so!
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className={styles.tabs}>
                            <div>
                              <p className={styles.icon}>
                                <img src={invites} />
                              </p>
                            </div>
                            <div className={styles.tabsTxt}>
                              <p>
                                <span className={styles.heading2}>
                                  Good Earth Events
                                </span>
                                <br />
                                Get exclusive access to curated Good Earth
                                experiences celebrating the best in design,
                                fashion, and the arts.
                              </p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className={cs(styles.heading1, globalStyles.voffset6)}>
                  How it works
                </div>
                <div className={cs(styles.list, globalStyles.voffset3)}>
                  <ul>
                    <li>
                      <img src={list1} />
                      <div className={globalStyles.txtNormal}>
                        Shop in-store or online.
                      </div>
                    </li>
                    <li>
                      <img src={list2} />
                      <div className={globalStyles.txtNormal}>
                        Earn upto 15% of your purchase value as Cerise Points.
                      </div>
                      <a
                        href="javascript:void(0);"
                        className={
                          this.state.readMore1 ? "" : globalStyles.hidden
                        }
                        onClick={this.showBlockMore1.bind(this)}
                      >
                        Read More
                      </a>
                      <div
                        className={
                          this.state.showblock1
                            ? globalStyles.txtNormal
                            : cs(globalStyles.txtNormal, globalStyles.hidden)
                        }
                      >
                        Cerise points are automatically credited to the member’s
                        account and can be redeemed on any future purchase,
                        online or in-store.
                      </div>
                      <a
                        href="javascript:void(0);"
                        className={
                          this.state.readLess1 ? "" : globalStyles.hidden
                        }
                        onClick={this.showBlockLess1.bind(this)}
                      >
                        Read Less
                      </a>
                    </li>
                    <li>
                      <img src={list3} />
                      <div className={globalStyles.txtNormal}>
                        {" "}
                        Redeem accumulated Cerise Points online or in-store.
                      </div>
                      <a
                        href="javascript:void(0);"
                        className={
                          this.state.readMore2 ? "" : globalStyles.hidden
                        }
                        onClick={this.showBlockMore2.bind(this)}
                      >
                        Read More
                      </a>
                      <div
                        className={
                          this.state.showblock2
                            ? globalStyles.txtNormal
                            : cs(globalStyles.txtNormal, globalStyles.hidden)
                        }
                      >
                        When a member redeems his/her Cerise points on a
                        purchase, the invoice value is automatically reduced by
                        the amount corresponding to the value of points (1
                        Cerise Point = 1 Re).
                      </div>
                      <a
                        href="javascript:void(0);"
                        className={
                          this.state.readLess2 ? "" : globalStyles.hidden
                        }
                        onClick={this.showBlockLess2.bind(this)}
                      >
                        Read Less
                      </a>
                    </li>
                  </ul>
                </div>
                <div className={cs(globalStyles.voffset5, styles.btm)}>
                  <div className={globalStyles.txtNormal}>
                    For further information, please refer to{" "}
                    <a
                      href="/customer-assistance/terms"
                      target="_blank"
                      className={cs(globalStyles.cerise, styles.txtUnderline)}
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/customer-assistance/faq"
                      target="_blank"
                      className={cs(globalStyles.cerise, styles.txtUnderline)}
                    >
                      FAQs
                    </a>
                    .
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
