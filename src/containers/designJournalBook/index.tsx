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
        <div className="col-xs-5 col-xs-offset-4 txt-caps flex-block">
          <div
            className={
              arrowClass
                ? "cursor-pointer chkarrow up-arrow"
                : "cursor-pointer chkarrow"
            }
            onClick={displayProducts}
          >
            show products
          </div>
          <div className="text-center">
            {currentIndex}/{totalSlides}
          </div>
          {imageSlider?.mainProduct ? (
            <div className="text-right">
              <a href={imageSlider?.mainProduct[0].url}>
                {" "}
                buy the journal{" "}
                <span className="cursor-pointer chkarrow right-arrow"></span>{" "}
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
          <div className="margin-t-30 col-xs-5 col-xs-offset-4 txt-caps flex-block">
            <div className=""></div>
            <div className="text-center">
              {currentIndex}/{totalSlides}
            </div>
            {imageSlider?.mainProduct ? (
              <div className="text-right">
                <a href={imageSlider?.mainProduct[0].url}>
                  {" "}
                  buy the journal{" "}
                  <span className="cursor-pointer chkarrow right-arrow"></span>{" "}
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
            <div className="margin-t-30 col-xs-5 col-xs-offset-4 txt-caps flex-block text-center">
              <a
                className="buy-journal-link"
                href={imageSlider?.mainProduct[0].url}
              >
                {" "}
                buy the journal{" "}
                <span className="cursor-pointer chkarrow right-arrow"></span>{" "}
              </a>
            </div>
          );
        } else {
          if (currentViews.length > 0 && currentViews[0] == 0) {
            html.push(
              <div className="margin-t-30 col-xs-5 col-xs-offset-4 txt-caps flex-block text-center">
                <a
                  className="buy-journal-link"
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
          <div className="row dj-bg dj-slider mobile-product-display">
            <div className="col-md-8 col-md-offset-2 col-xs-12">
              {renderDesktopImage()}
              <div className="mobile-arrows">
                <div className="arrow-container">
                  {associatedProducts.length > 0 && (
                    <div className="mobile-show-product">
                      <span>SHOP PRODUCTS ON PAGE</span>
                      <span
                        onClick={displayProducts}
                        className="mobile-show-product-icon"
                      >
                        <img
                          src="/static/img/icons-library.svg"
                          alt="plus-icon"
                        />
                      </span>
                    </div>
                  )}
                  <div className="arrow left-arrow">
                    <span
                      className="left-arrow"
                      // name="left-arrow"
                      onClick={handleKeyDown}
                    >
                      <i className="icon icon_zz_arrow_left_dj"></i>
                    </span>
                  </div>
                  <div className="text-center">
                    {currentIndex}/{totalSlides}
                  </div>
                  <div className="arrow right-arrow">
                    <span
                      className="right-arrow"
                      // name="right-arrow"
                      onClick={handleKeyDown}
                    >
                      <i className="icon icon_zz_arrow_right_dj"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {associatedProducts.length > 0 ? (
              <div className="col-xs-12 txt-caps flex-block text-center mobile-show-products">
                <div className="cursor-pointer" onClick={displayProducts}>
                  {" "}
                  Shop Products
                </div>
              </div>
            ) : (
              <div className="col-xs-12 txt-caps flex-block text-center mobile-show-products">
                <div className=""></div>
              </div>
            )}
            {imageSlider?.mainProduct ? (
              <div className="col-xs-12 col-sm-12 voffset4 hidden-md hidden-lg fixed-btn">
                <button className="cerise-btn">
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
          <div className={showProducts ? "row dj-bg " : "hidden"}>
            {associatedProducts.length > 0
              ? associatedProducts.map((data, i) => {
                  return (
                    <div className="col-xs-6" id={data.sku} key={i}>
                      <div className="img-diff">
                        <div className="imagebox-new">
                          <a href={data.url}>
                            <img
                              src={data.image}
                              className="image-result-new"
                            />
                          </a>
                        </div>

                        <div className="image-content">
                          <p className="product-n">
                            <a href={data.url}> {data.name} </a>
                          </p>
                          <p className="product-n">
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
            <div className="breadcrumbs-block">
              <div className="row minimumWidth">
                <div className="col-md-5 col-md-offset-1">
                  <div className="pdp_breadcrumbs">
                    <span>
                      {" "}
                      <a href="/stories"> Stories </a> &gt;{" "}
                    </span>
                    <span>
                      {" "}
                      <a href="/designjournal"> Design Journals </a> &gt;{" "}
                    </span>
                    <span>
                      {" "}
                      <a> {imageSlider?.mainProduct[0].name} </a>{" "}
                    </span>
                  </div>
                </div>
                <div className="col-md-5 col-xs-10 col-xs-offset-1"></div>
                <div className="col-md-1"></div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="dj-space">
            <div className="row dj-bg dj-slider">
              <div className="arrow-container">
                <div className="arrow">
                  {associatedProducts.length > 0 && (
                    <div className="show-product-action-container">
                      <div
                        className="show-product-action"
                        onClick={displayProducts}
                      >
                        <span className="show-product-icon cursor-pointer">
                          <img src="/static/img/icons-library.svg" />
                        </span>
                        <p className="show-products-text">
                          Show Products On Page
                        </p>
                      </div>
                    </div>
                  )}
                  <span
                    className="left-arrow"
                    // name="left-arrow"
                    onClick={handleKeyDown}
                  >
                    <i className="icon icon_zz_arrow_left_dj"></i>
                    <span>Previous Page</span>
                  </span>
                </div>
                {renderDesktopImage()}
                <div className="arrow">
                  <span
                    className="right-arrow"
                    // name="right-arrow"
                    onClick={handleKeyDown}
                  >
                    <i className="icon icon_zz_arrow_right_dj"></i>
                    <span>Next Page</span>
                  </span>
                </div>
              </div>
              {renderCount()}
            </div>
            <div className="row dj-slider2">
              <div
                className={
                  showProducts
                    ? "col-md-6 col-md-offset-3 pdp-slider-recommend"
                    : "col-md-8 col-md-offset-2 dj-slider2 "
                }
              >
                {imageSlider?.imageData && currentIndex > 0 && showProducts ? (
                  associatedProducts.length > 5 ? (
                    <Slider {...settingsProducts}>
                      {associatedProducts.map((data, i) => {
                        return (
                          <div key={i}>
                            <div className="img-diff">
                              <div className="">
                                <a href={data.url}>
                                  <img
                                    src={data.image}
                                    className="img-responsive"
                                  />
                                </a>
                              </div>

                              <div className="image-content">
                                <p className="product-n">
                                  <a href={data.url}> {data.name} </a>
                                </p>
                                <p className="product-n">
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
                        <div className="col-md-3" id={data.sku} key={i}>
                          <div className="img-diff">
                            <div className="">
                              <a href={data.url}>
                                <img
                                  src={data.image}
                                  className="img-responsive"
                                />
                              </a>
                            </div>

                            <div className="image-content">
                              <p className="product-n">
                                <a href={data.url}> {data.name} </a>
                              </p>
                              <p className="product-n">
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
