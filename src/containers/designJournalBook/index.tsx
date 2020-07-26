import React, { useEffect, useState } from "react";
// import PropTypes from 'prop-types'
// import {Provider} from 'react-redux'
// import BaseLayout from "components/base_layout"
// import * as mapper from "pages/designjournal/mapper/resetM"
// import {connect} from 'react-redux'
import Slider from "react-slick";
// import axios from 'axios'
// import Config from 'components/config'
import Flipbook from "./flipBook";
// import { throws } from 'assert';
import $ from "jquery";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { currencyCodes } from "constants/currency";
import { DesignJournalBookData, DesignJournalProduct } from "./typings";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import SecondaryHeader from "components/SecondaryHeader";
import { Link } from "react-router-dom";

type Props = {};

const DesignJournalBook: React.FC<Props> = props => {
  const { mobile } = useSelector((state: AppState) => state.device);
  const currency = useSelector((state: AppState) => state.currency);

  const [
    showProducts
    // setShowProducts
  ] = useState(false);
  const [
    arrowClass
    // setArrowClass
  ] = useState(false);
  const [
    imageSlider
    // setImageSlider
  ] = useState<DesignJournalBookData>();
  const [totalSlides, setTotalSlides] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentViews, setCurrentViews] = useState<number[]>([]);
  const [associatedProducts, setAssociatedProducts] = useState<
    DesignJournalProduct[]
  >([]);

  // let self = this
  const settingsProducts = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
  };

  const checkInView = (el: any) => {
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
  };

  const handleScroll = () => {
    if (!document.getElementsByClassName("journal-book")[0]) return false;

    if (
      checkInView(document.getElementsByClassName("footer")[0]) ||
      checkInView(document.getElementsByClassName("footer-bottom")[0])
    ) {
      document.getElementsByClassName("journal-book")[0].classList.add("abs");
    } else {
      document
        .getElementsByClassName("journal-book")[0]
        .classList.remove("abs");
    }
  };

  useEffect(() => {
    // var countImage = 0;
    // var sliderImages = [];
    // let foldercode = location.search.split("id=")[1]
    // let formData = new FormData()
    // formData.append('folder_code', foldercode)
    // axios.post(Config.hostname + 'myapi/design_journal/', formData
    // ).then((response) => {
    //     setState({
    //         imageSlider: response.data[0] ? response.data[0]: []
    //     })

    // })
    // window.addEventListener('scroll', handleScroll);
    // document.addEventListener('keyDown', handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openJournal = () => {
    if (currentViews[0] == 0) {
      $("#flipBook").turn("next");
    }
  };

  // componentWillUnmount() {
  //     window.removeEventListener('scroll', handleScroll)
  // }

  const displayProducts = () => {
    // setState({
    //     showProducts: !showProducts,
    //     arrowClass: !arrowClass
    // }, () => {
    //     if (showProducts) {
    //         const element = document.getElementById(associatedProducts[0].sku);
    //         if (element) {
    //             element.scrollIntoView(true);
    //             window.scrollBy(0, -350);
    //         }
    //     } else {
    //         const element = document.getElementById("flipBook");
    //         element.scrollIntoView(true);
    //         window.scrollBy(0, -150);
    //     }
    // })
  };

  // const setCurrentIndex = (page) => {
  //     setState({
  //         currentIndex: page
  //     })
  // }

  // const setTotalSlides = (total) => {
  //     setState({
  //         totalSlides: total
  //     })
  // }

  const handleCurrentViews = (view: number[]) => {
    // const self = this;

    setCurrentViews(view);

    const associatedProducts: DesignJournalProduct[] = [];
    currentViews.map((viewIndex: number) => {
      if (viewIndex > 0) {
        imageSlider &&
          imageSlider.imageData[viewIndex - 1].associatedProducts.map(
            (data, i) => {
              associatedProducts.push(data);
            }
          );
      }
    });
    setAssociatedProducts(associatedProducts);
  };

  const renderDesktopImage = () => {
    if (imageSlider && imageSlider.imageData) {
      return (
        <Flipbook
          setCurrentViews={handleCurrentViews}
          data={imageSlider}
          mobile={mobile}
          noOfPages={imageSlider.imageData.length}
          setCurrentIndex={setCurrentIndex}
          setTotalViews={setTotalSlides}
        />
      );
    }
    return "";
  };

  const handleKeyDown = (event: any) => {
    if (
      event.target.innerText == "PREVIOUS PAGE" ||
      event.target.className == "icon icon_zz_arrow_left_dj"
    ) {
      $("#flipBook").turn("previous");
    }
    if (
      event.target.innerText == "NEXT PAGE" ||
      event.target.className == "icon icon_zz_arrow_right_dj"
    ) {
      $("#flipBook").turn("next");
    }
    if (event.keyCode === 37) {
      $("#flipBook").turn("previous");
    }
    if (event.keyCode === 39) {
      $("#flipBook").turn("next");
    }
  };

  const renderCount = () => {
    const html = [];
    if (associatedProducts.length > 0) {
      html.push(
        <div
          className={cs(
            bootstrapStyles.col5,
            bootstrapStyles.offset4,
            styles.txtCaps,
            styles.flexBlock
          )}
        >
          <div
            className={
              arrowClass
                ? cs(globalStyles.pointer, styles.chkarrow, styles.upArrow)
                : cs(globalStyles.pointer, styles.chkarrow)
            }
            onClick={displayProducts}
          >
            show products
          </div>
          <div className={globalStyles.textCenter}>
            {currentIndex}/{totalSlides}
          </div>
          {imageSlider?.mainProduct ? (
            <div className={globalStyles.textRight}>
              <a href={imageSlider?.mainProduct[0].url}>
                {" "}
                buy the journal{" "}
                <span
                  className={cs(
                    globalStyles.pointer,
                    styles.chkarrow,
                    styles.rightArrow
                  )}
                ></span>{" "}
              </a>
            </div>
          ) : (
            ""
          )}
        </div>
      );
    } else {
      if (
        currentViews[0] > 1 &&
        currentViews[0] < (imageSlider ? imageSlider.imageData.length - 1 : 0)
      ) {
        html.push(
          <div
            className={cs(
              globalStyles.marginT30,
              bootstrapStyles.col5,
              bootstrapStyles.offset4,
              styles.txtCaps,
              styles.flexBlock
            )}
          >
            <div className=""></div>
            <div className={globalStyles.textCenter}>
              {currentIndex}/{totalSlides}
            </div>
            {imageSlider?.mainProduct ? (
              <div className={globalStyles.textRight}>
                <a href={imageSlider?.mainProduct[0].url}>
                  {" "}
                  buy the journal{" "}
                  <span
                    className={cs(
                      globalStyles.pointer,
                      styles.chkarrow,
                      styles.rightArrow
                    )}
                  ></span>{" "}
                </a>
              </div>
            ) : (
              ""
            )}
          </div>
        );
      } else {
        if (
          currentViews.length > 0 &&
          currentViews[0] == imageSlider?.imageData.length
        ) {
          html.push(
            <div
              className={cs(
                globalStyles.marginT30,
                bootstrapStyles.col5,
                bootstrapStyles.offset4,
                styles.txtCaps,
                styles.flexBlock,
                globalStyles.textCenter
              )}
            >
              <a
                className={styles.buyJournalLink}
                href={imageSlider?.mainProduct[0].url}
              >
                {" "}
                buy the journal{" "}
                <span
                  className={cs(
                    globalStyles.pointer,
                    styles.chkarrow,
                    styles.rightArrow
                  )}
                ></span>{" "}
              </a>
            </div>
          );
        } else {
          if (currentViews.length > 0 && currentViews[0] == 0) {
            html.push(
              <div
                className={cs(
                  globalStyles.marginT30,
                  bootstrapStyles.col5,
                  bootstrapStyles.offset4,
                  styles.txtCaps,
                  styles.flexBlock,
                  globalStyles.textCenter
                )}
              >
                <a
                  className={styles.buyJournalLink}
                  href={"#"}
                  onClick={openJournal}
                >
                  {" "}
                  Open Journal
                </a>
              </div>
            );
          }
        }
      }
    }
    return html;
  };

  return (
    <div>
      {mobile ? (
        <div>
          <div
            className={cs(bootstrapStyles.row, styles.djBg, styles.djSlider)}
          >
            <div
              className={cs(
                bootstrapStyles.colMd8,
                bootstrapStyles.offsetMd2,
                bootstrapStyles.col12
              )}
            >
              {renderDesktopImage()}
              <div className={styles.mobileArrows}>
                <div className={styles.arrowContainer}>
                  {associatedProducts.length > 0 && (
                    <div className={styles.mobileShowProduct}>
                      <span>SHOP PRODUCTS ON PAGE</span>
                      <span
                        onClick={displayProducts}
                        className={styles.mobileShowProductIcon}
                      >
                        <img
                          src="/static/img/icons-library.svg"
                          alt="plus-icon"
                        />
                      </span>
                    </div>
                  )}
                  <div className={cs(styles.arrow, styles.leftArrow)}>
                    <span
                      className={styles.leftArrow}
                      // name="styles.leftArrow"
                      onClick={handleKeyDown}
                    >
                      <i className="icon icon_zz_arrow_left_dj"></i>
                    </span>
                  </div>
                  <div className={globalStyles.textCenter}>
                    {currentIndex}/{totalSlides}
                  </div>
                  <div className={cs(styles.arrow, styles.rightArrow)}>
                    <span
                      className={styles.rightArrow}
                      // name="styles.rightArrow"
                      onClick={handleKeyDown}
                    >
                      <i className="icon icon_zz_arrow_right_dj"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {associatedProducts.length > 0 ? (
              <div
                className={cs(
                  bootstrapStyles.col12,
                  styles.txtCaps,
                  styles.flexBlock,
                  globalStyles.textCenter,
                  styles.mobileShowProduct
                )}
              >
                <div className={globalStyles.pointer} onClick={displayProducts}>
                  {" "}
                  Shop Products
                </div>
              </div>
            ) : (
              <div
                className={cs(
                  bootstrapStyles.col12,
                  styles.txtCaps,
                  styles.flexBlock,
                  globalStyles.textCenter,
                  styles.mobileShowProduct
                )}
              >
                <div className=""></div>
              </div>
            )}
            {imageSlider?.mainProduct ? (
              <div
                className={cs(
                  bootstrapStyles.col12,
                  bootstrapStyles.colSm12,
                  globalStyles.voffset4,
                  styles.fixedBtn
                )}
              >
                <button className={globalStyles.ceriseBtn}>
                  <a href={imageSlider?.mainProduct[0].url}>
                    {" "}
                    buy the journal{" "}
                  </a>
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
          <div
            className={
              showProducts
                ? cs(bootstrapStyles.row, styles.djBg)
                : globalStyles.hidden
            }
          >
            {associatedProducts.length > 0
              ? associatedProducts.map((data, i) => {
                  return (
                    <div className={bootstrapStyles.col6} id={data.sku} key={i}>
                      <div className={styles.imgDiff}>
                        <div className={styles.imageboxNew}>
                          <a href={data.url}>
                            <img
                              src={data.image}
                              className={styles.imageResultNew}
                            />
                          </a>
                        </div>

                        <div className={styles.imageContent}>
                          <p className={styles.productN}>
                            <a href={data.url}> {data.name} </a>
                          </p>
                          <p className={styles.productN}>
                            {String.fromCharCode(currencyCodes[currency])}&nbsp;{" "}
                            {data.price[currency]}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
      ) : (
        <div>
          {imageSlider?.mainProduct ? (
            // <div className="breadcrumbs-block">
            //   <div className="row minimumWidth">
            //     <div className="bootstrapStyles.colMd5 bootstrapStyles.offsetMd1">
            //       <div className="pdp_breadcrumbs">
            //         <span>
            //           {" "}
            //           <a href="/stories"> Stories </a> &gt;{" "}
            //         </span>
            //         <span>
            //           {" "}
            //           <a href="/designjournal"> Design Journals </a> &gt;{" "}
            //         </span>
            //         <span>
            //           {" "}
            //           <a> {imageSlider?.mainProduct[0].name} </a>{" "}
            //         </span>
            //       </div>
            //     </div>
            //     <div className={cs(bootstrapStyles.colMd5, bootstrapStyles.col10, bootstrapStyles.offset1)}></div>
            //     <div className={bootstrapStyles.colMd1}></div>
            //   </div>
            // </div>
            <SecondaryHeader>
              <div
                className={cs(
                  bootstrapStyles.colMd7,
                  bootstrapStyles.offsetMd1,
                  styles.header,
                  globalStyles.verticalMiddle,
                  styles.heading
                )}
              >
                <span>
                  <Link to="/stories">Stories</Link>
                  &nbsp;&gt;&nbsp;
                </span>
                <span>
                  <Link to="/designjournal">Design Journals</Link>
                  &nbsp;&gt;&nbsp;
                </span>
                <span>{imageSlider?.mainProduct[0].name}</span>
              </div>
            </SecondaryHeader>
          ) : (
            ""
          )}
          <div className={styles.djSpace}>
            <div
              className={cs(bootstrapStyles.row, styles.djBg, styles.djSlider)}
            >
              <div className={styles.arrowContainer}>
                <div className={styles.arrow}>
                  {associatedProducts.length > 0 && (
                    <div className={styles.showProductActionContainer}>
                      <div
                        className={styles.showProductAction}
                        onClick={displayProducts}
                      >
                        <span
                          className={cs(
                            styles.showProductIcon,
                            globalStyles.pointer
                          )}
                        >
                          <img src="/static/img/icons-library.svg" />
                        </span>
                        <p className={styles.showProductsText}>
                          Show Products On Page
                        </p>
                      </div>
                    </div>
                  )}
                  <span
                    className={styles.leftArrow}
                    // name="styles.leftArrow"
                    onClick={handleKeyDown}
                  >
                    <i className="icon icon_zz_arrow_left_dj"></i>
                    <span>Previous Page</span>
                  </span>
                </div>
                {renderDesktopImage()}
                <div className={styles.arrow}>
                  <span
                    className={styles.rightArrow}
                    // name="styles.rightArrow"
                    onClick={handleKeyDown}
                  >
                    <i className="icon icon_zz_arrow_right_dj"></i>
                    <span>Next Page</span>
                  </span>
                </div>
              </div>
              {renderCount()}
            </div>
            <div className={cs(bootstrapStyles.row, styles.djSlider2)}>
              <div
                className={
                  showProducts
                    ? cs(
                        bootstrapStyles.colMd6,
                        bootstrapStyles.offsetMd3,
                        styles.pdpSliderRecommend
                      )
                    : cs(
                        bootstrapStyles.colMd8,
                        bootstrapStyles.offsetMd2,
                        styles.djSlider2
                      )
                }
              >
                {imageSlider?.imageData && currentIndex > 0 && showProducts ? (
                  associatedProducts.length > 5 ? (
                    <Slider {...settingsProducts}>
                      {associatedProducts.map((data, i) => {
                        return (
                          <div key={i}>
                            <div className={styles.imgDiff}>
                              <div className="">
                                <a href={data.url}>
                                  <img
                                    src={data.image}
                                    className={globalStyles.imgResponsive}
                                  />
                                </a>
                              </div>

                              <div className={styles.imageContent}>
                                <p className={styles.productN}>
                                  <a href={data.url}> {data.name} </a>
                                </p>
                                <p className={styles.productN}>
                                  {String.fromCharCode(currencyCodes[currency])}
                                  &nbsp; {data.price[currency]}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </Slider>
                  ) : (
                    associatedProducts.map((data, i) => {
                      return (
                        <div
                          className={bootstrapStyles.colMd3}
                          id={data.sku}
                          key={i}
                        >
                          <div className={styles.imgDiff}>
                            <div className="">
                              <a href={data.url}>
                                <img
                                  src={data.image}
                                  className={globalStyles.imgResponsive}
                                />
                              </a>
                            </div>

                            <div className={styles.imageContent}>
                              <p className={styles.productN}>
                                <a href={data.url}> {data.name} </a>
                              </p>
                              <p className={styles.productN}>
                                {String.fromCharCode(currencyCodes[currency])}
                                &nbsp; {data.price[currency]}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignJournalBook;
