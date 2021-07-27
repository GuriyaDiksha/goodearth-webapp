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
import rewardPoints from "../../images/loyalty/points/rewardpoints.svg";
import doublePointDays from "../../images/loyalty/points/doublePointDays.svg";
import freeShipping from "../../images/loyalty/points/freeShipping.svg";
import saleAccess from "../../images/loyalty/points/saleAccess.svg";
import loungeAccess from "../../images/loyalty/points/loungeAccess.svg";
import paro from "../../images/loyalty/points/paro.svg";
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
import { connect } from "react-redux";
import RewardItem from "./rewardItem";

const mapStateToProps = (state: AppState) => {
  return {
    mobile: state.device.mobile,
    showTimer: state.info.showTimer
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

class LoyaltyLanding extends Component<Props, State> {
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
    this.setState({
      readMore1: false,
      readLess1: true,
      showblock1: true,
      showBlockLess1: false
    });
  }

  showBlockMore2() {
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

  itemsData = [
    {
      image: rewardPoints,
      heading: "Cerise Points",
      subHeading: "Earn 10% of the value of each of your purchases.",
      isCeriseOnly: true
    },
    {
      image: doublePointDays,
      heading: "Double Point Days",
      subHeading:
        "Enjoy a more rewarding shopping experience with 2x reward points on special days.",
      isCeriseOnly: true
    },
    {
      image: freeShipping,
      heading: "Free Shipping",
      subHeading:
        "Your online and in-store orders delivered at no additional charge.*",
      isCeriseOnly: true
    },
    {
      image: saleAccess,
      heading: "Sale Access",
      subHeading: "Exclusive first-day access to Good Earth’s Annual Sales.",
      isCeriseOnly: true
    },
    {
      image: specialPreviews,
      heading: "Special Previews",
      subHeading:
        "Be the first to enjoy our newly launched collections in store and online.",
      isCeriseOnly: true
    },
    {
      image: customerCare,
      heading: "Dedicated Customer Care",
      subHeading:
        "Seamless shopping experiences via exclusive Cerise customer assistance.",
      isCeriseOnly: true
    },
    {
      image: ps,
      heading: "Dedicated Personal Shopper",
      subHeading: "Tailor made retail experience, at your convenience.",
      isCeriseOnly: false
    },
    {
      image: styling,
      heading: "Styling by Appointment",
      subHeading:
        "Personal apparel stylist on appointment, for your special occasions.",
      isCeriseOnly: false
    },
    {
      image: gifting,
      heading: "Gifting Concierge",
      subHeading:
        "Our in-house experts help you personalize and deliver the perfect gift to your loved ones.",
      isCeriseOnly: false
    },
    {
      image: invites,
      heading: "Curated Events",
      subHeading:
        "Exclusive access to Good Earth experiences celebrating design, fashion and art.",
      isCeriseOnly: false
    },
    {
      image: paro,
      heading: "Discover PARO",
      subHeading:
        "Indulge in custom experiences from Paro, a luxury wellness brand by Good Earth.",
      isCeriseOnly: false
    },
    {
      image: loungeAccess,
      heading: "Berouj Lounge Access",
      subHeading:
        "Enjoy unlimited access to our upcoming bespoke atelier, complete with exclusive collections, butler services, and private styling appointments.",
      isCeriseOnly: false
    }
  ];
  render() {
    const { tabs } = this.state;

    const rewardsAndBenefitsSection = (
      <>
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
                this.state.tabsClassFirst ? styles.active : styles.inactive
              }
              onClick={this.tabFirst.bind(this)}
            >
              {this.state.tabs ? (
                <img src={ceriseClub} width="50%" />
              ) : (
                <img src={ceriseClub} width="50%" className={styles.grayimg} />
              )}
            </li>
            <li
              className={
                this.state.tabsClassSec ? styles.active : styles.inactive
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

          {
            <div className={styles.tabContent}>
              <ul>
                {this.itemsData.map(item => {
                  const { isCeriseOnly, ...rest } = item;
                  const isActive = isCeriseOnly || !tabs;
                  const props = { ...rest, isActive };
                  return <RewardItem {...props} key={item.heading} />;
                })}
              </ul>
              <p className={styles.txtFooter}>
                *For Cerise Club members, this benefit is valid on all domestic
                orders over ₹ 20,000.{" "}
              </p>
            </div>
          }
        </div>
      </>
    );
    return (
      <div>
        {this.props.mobile ? (
          <div
            className={cs(styles.loyalty, {
              [styles.loyaltyTimer]: this.props.showTimer
            })}
          >
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
                {/* <div
                  className={cs(
                    styles.txtNormal,
                    styles.txtBold,
                    globalStyles.voffset4
                  )}
                >
                  {" "}
                  FROM OUR HEARTS TO YOUR HOME
                </div> */}
                <div className={cs(styles.txtNormal, globalStyles.voffset4)}>
                  {" "}
                  A bespoke experience for our loyal customers who share our
                  vision of celebrating Indian craftsmanship and sustainability.
                </div>
                {/* <div className={cs(styles.txtNormal, globalStyles.voffset2)}>
                  We are delighted to welcome you to Cerise Program as an
                  extended member of the Good Earth family to become a part of
                  our world and give us an opportunity to get to know you
                  better.
                </div> */}
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
                          <div className={styles.txtNormal}>
                            Shop in-store or online.
                          </div>
                        </li>
                        <li>
                          <img src={list2} />
                          <div className={styles.txtNormal}>
                            Earn upto 15% of your purchase value as Cerise
                            Points.
                          </div>
                          {/* <a
                        href="javascript:void(0);"
                        className={
                          this.state.readMore1 ? "" : globalStyles.hidden
                        }
                        onClick={this.showBlockMore1.bind(this)}
                      >
                        Read More
                      </a> */}
                          <div
                            className={
                              this.state.showblock1
                                ? styles.txtNormal
                                : cs(styles.txtNormal, globalStyles.hidden)
                            }
                          >
                            For Cerise Club members, 10% of the purchase value
                            and for Cerise Sitara members, 15% of the purchase
                            value will be automatically credited to the member’s
                            name as reward points. Reward points are a credit in
                            the member’s account with us and can be redeemed on
                            any future purchase, online or in-store.
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
                          <div className={styles.txtNormal}>
                            {" "}
                            Redeem accrued Cerise Points during future online or
                            in-store purchases.
                          </div>
                          {/* <a
                        href="javascript:void(0);"
                        className={
                          this.state.readMore2 ? "" : globalStyles.hidden
                        }
                        onClick={this.showBlockMore2.bind(this)}
                      >
                        Read More
                      </a> */}
                          <div
                            className={
                              this.state.showblock2
                                ? styles.txtNormal
                                : cs(styles.txtNormal, globalStyles.hidden)
                            }
                          >
                            When a member redeems the reward points in the next
                            purchase, the invoice value will automatically be
                            reduced by the amount you have as reward points.
                            Once this purchase is completed, 10% (for Cerise
                            Club) or 15% (for Cerise Sitara) of that final paid
                            amount will be credited again into the member’s
                            account as reward points to be used in the next
                            purchase.
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
                    <div
                      className={cs(styles.subheading1, globalStyles.voffset1)}
                    >
                      Each Cerise Point is equivalent to ₹ 1.
                    </div>
                  </div>
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
                  HOW TO BECOME A MEMBER
                </div>
                <div className={cs(styles.txtNormal, globalStyles.voffset2)}>
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
                {rewardsAndBenefitsSection}
              </div>
            </div>

            <div
              className={cs(bootstrapStyles.row, styles.basic, styles.center)}
            >
              <div className={globalStyles.voffset3}>
                <div className={cs(styles.txtNormal, globalStyles.textCenter)}>
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
                    href="/customer-assistance/terms#faq"
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
          <div
            className={cs(styles.loyalty, {
              [styles.loyaltyTimer]: this.props.showTimer
            })}
          >
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
                <img src={flower4} className={styles.imgResponsive} />
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
                  bootstrapStyles.col11,
                  bootstrapStyles.offset1,
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
                <div className={cs(styles.txtNormal, globalStyles.voffset4)}>
                  {" "}
                  A bespoke experience for our loyal customers who share our
                  vision of celebrating Indian craftsmanship and sustainability.
                </div>

                <div className={cs(styles.heading1, globalStyles.voffset5)}>
                  How it works
                </div>
                <div className={cs(styles.list, globalStyles.voffset3)}>
                  <ul>
                    <li>
                      <img src={list1} />
                      <div className={styles.txtNormal}>
                        Shop in-store or online.
                      </div>
                    </li>
                    <li>
                      <img src={list2} />
                      <div className={styles.txtNormal}>
                        Earn upto 15% of your purchase value as Cerise Points.
                      </div>
                      {/* <a
                        href="javascript:void(0);"
                        className={
                          this.state.readMore1 ? "" : globalStyles.hidden
                        }
                        onClick={this.showBlockMore1.bind(this)}
                      >
                        Read More
                      </a> */}
                      <div
                        className={
                          this.state.showblock1
                            ? styles.txtNormal
                            : cs(styles.txtNormal, globalStyles.hidden)
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
                      <div className={styles.txtNormal}>
                        {" "}
                        Redeem accrued Cerise Points during future online or
                        in-store purchases.
                      </div>
                      {/* <a
                        href="javascript:void(0);"
                        className={
                          this.state.readMore2 ? "" : globalStyles.hidden
                        }
                        onClick={this.showBlockMore2.bind(this)}
                      >
                        Read More
                      </a> */}
                      <div
                        className={
                          this.state.showblock2
                            ? styles.txtNormal
                            : cs(styles.txtNormal, globalStyles.hidden)
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
                <div className={cs(styles.subheading1, globalStyles.voffset1)}>
                  Each Cerise Point is equivalent to ₹ 1.
                </div>
                <div className={cs(styles.heading1, globalStyles.voffset6)}>
                  HOW TO BECOME A MEMBER
                </div>
                <div className={cs(styles.txtNormal, globalStyles.voffset2)}>
                  Our customers enjoy automatic enrolment as{" "}
                  <span className={globalStyles.cerise}>Cerise Club</span>{" "}
                  members based on reaching an annual purchase value of ₹ 1
                  lakh. As you cross a ₹ 5 lakh annual purchase value, you
                  unlock exclusive privileges as an exclusive{" "}
                  <span className={globalStyles.cerise}>Cerise Sitara</span>{" "}
                  member.
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
                {rewardsAndBenefitsSection}
                <div className={cs(globalStyles.voffset5, styles.btm)}>
                  <div className={styles.txtNormal}>
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
                      href="/customer-assistance/terms#faq"
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

export default connect(mapStateToProps, {})(LoyaltyLanding);
