import React, { useEffect } from "react";
// import ReactDOM from "react-dom";
import $ from "jquery";
import "./jqueryLoader.js";
import "./turn.js";
import { DesignJournalBookData } from "./typings.js";

type Props = {
  data: DesignJournalBookData;
  noOfPages: number;
  mobile: boolean;
  setCurrentViews: (view: any) => void;
  setCurrentIndex: (x: number) => void;
  setTotalViews: (x: number) => void;
};

const Flipbook: React.FC<Props> = props => {
  const setHeightAndWidthDynamically = () => {
    const height = props.mobile ? "217px" : "370px";
    const width = props.mobile ? "145px" : "246px";
    const heightCanvas = props.mobile ? "280px" : "400px";
    const widthCanvas = props.mobile ? "320px" : "530px";
    const top = props.mobile ? "9px" : "11px";
    const widthDepth = props.mobile ? "11px" : "16px";
    const heightDepth = props.mobile ? "220px" : "375px";
    $(".flipBook .depth").css({
      top: top,
      height: heightDepth,
      width: widthDepth
    });
    $(".flipBook .own-size")
      .width(width)
      .height(height);
    $("#canvas")
      .width(widthCanvas)
      .height(heightCanvas);
    $("#canvas-mobile")
      .width(widthCanvas)
      .height(heightCanvas);
  };

  const isChrome = () => {
    return navigator.userAgent.indexOf("Chrome") != -1;
  };

  const zoomOut = () => {
    const transitionEnd = $.cssTransitionEnd(),
      completeTransition = function(e: any) {
        $("#book-zoom").unbind(transitionEnd);
        $(".flipBook").turn("disable", false);
        $("body").css({ overflow: "auto" });
      };

    $(".flipBook").data().zoomIn = false;

    $(window).unbind("resize", zoomOut);

    $(".zoom-pic").remove();
    $("#book-zoom").transform("scale(1, 1)");

    if (transitionEnd) $("#book-zoom").bind(transitionEnd, completeTransition);
    else setTimeout(completeTransition, 1000);
  };

  const zoomThis = (pic: any) => {
    let position: any, translate;
    const tmpContainer = $("<div />", { class: "zoom-pic" }),
      transitionEnd = $.cssTransitionEnd(),
      tmpPic = $("<img />"),
      zCenterX = $("#book-zoom").width() / 2,
      zCenterY = $("#book-zoom").height() / 2,
      bookPos = $("#book-zoom").offset(),
      picPos = {
        left: pic.offset().left - bookPos.left,
        top: pic.offset().top - bookPos.top
      },
      completeTransition = function() {
        $("#book-zoom").unbind(transitionEnd);
        if ($(".flipBook").data().zoomIn) {
          tmpContainer.appendTo($("body"));
          $("body").css({ overflow: "hidden" });
          tmpPic
            .css({
              margin: position.top + "px " + position.left + "px"
            })
            .appendTo(tmpContainer)
            .fadeOut(0)
            .fadeIn(500);
        }
      };
    $(".flipBook").data().zoomIn = true;
    $(".flipBook").turn("disable", true);
    $(window).resize(zoomOut);
    tmpContainer.click(zoomOut);
    tmpPic.load(function() {
      const realWidth = $(tmpPic)[0].width,
        realHeight = $(tmpPic)[0].height,
        zoomFactor = realWidth / pic.width(),
        picPosition = {
          top: (picPos.top - zCenterY) * zoomFactor + zCenterY + bookPos.top,
          left: (picPos.left - zCenterX) * zoomFactor + zCenterX + bookPos.left
        };
      position = {
        top: ($(window).height() - realHeight) / 2,
        left: ($(window).width() - realWidth) / 2
      };
      translate = {
        top: position.top - picPosition.top,
        left: position.left - picPosition.left
      };
      $(".samples .bar").css({ visibility: "hidden" });
      $("#book-zoom").transform(
        "translate(" +
          translate.left +
          "px, " +
          translate.top +
          "px)" +
          "scale(" +
          zoomFactor +
          ", " +
          zoomFactor +
          ")"
      );

      if (transitionEnd)
        $("#book-zoom").bind(transitionEnd, completeTransition);
      else setTimeout(completeTransition, 1000);
    });
    tmpPic.attr("src", pic.attr("src"));
  };

  const zoomHandle = (e: any) => {
    if ($(".flipBook").data().zoomIn) zoomOut();
    else if (e.target && $(e.target).hasClass("zoom-this")) {
      zoomThis($(e.target));
    }
  };

  const updateDepth = (book: any, newPage?: any) => {
    const page = book.turn("page"),
      pages = book.turn("pages");
    let depthWidth = 16 * Math.min(1, (page * 2) / pages);
    newPage = newPage || page;
    if (newPage > 3)
      $(".flipBook .p2 .depth").css({
        width: depthWidth,
        left: 20 - depthWidth
      });
    else $(".flipBook .p2 .depth").css({ width: 0 });
    depthWidth = 16 * Math.min(1, ((pages - page) * 2) / pages);
    if (newPage < pages - 3)
      $(`.flipBook .p${props.noOfPages - 1} .depth`).css({
        width: depthWidth,
        right: 20 - depthWidth
      });
    else $(`.flipBook .p${props.noOfPages - 1} .depth`).css({ width: 0 });
  };

  const getViewNumber = (book: any, page: any) => {
    return parseInt(((page || book.turn("page")) / 2 + 1).toString(), 10);
  };

  const numberOfViews = (book: any) => {
    return book.turn("pages") / 2 + 1;
  };

  const initializeFlipBook = () => {
    // const _self = this;
    const flipbook = $(".flipBook");
    flipbook.bind($.isTouch ? "touchend" : "click", zoomHandle);
    const width = props.mobile ? "320px" : "530px";
    const height = props.mobile ? "240px" : "400px";
    flipbook.turn({
      elevation: 50,
      acceleration: !isChrome(),
      autoCenter: true,
      gradients: true,
      width: width,
      height: height,
      duration: 1000,
      pages: props.noOfPages,
      when: {
        turning: function(e: any, page: any, view: any) {
          const book = $(this),
            currentPage = book.turn("page"),
            pages = book.turn("pages");
          if (currentPage > 3 && currentPage < pages - 3) {
            if (page == 1) {
              book
                .turn("page", 2)
                .turn("stop")
                .turn("page", page);
              e.preventDefault();
              return;
            } else if (page == pages) {
              book
                .turn("page", pages - 1)
                .turn("stop")
                .turn("page", page);
              e.preventDefault();
              return;
            }
          } else if (page > 3 && page < pages - 3) {
            if (currentPage == 1) {
              book
                .turn("page", 2)
                .turn("stop")
                .turn("page", page);
              e.preventDefault();
              return;
            } else if (currentPage == pages) {
              book
                .turn("page", pages - 1)
                .turn("stop")
                .turn("page", page);
              e.preventDefault();
              return;
            }
          }
          updateDepth(book, page);
          if (page >= 2) $(".flipBook .p2").addClass("fixed");
          else $(".flipBook .p2").removeClass("fixed");
          if (page < book.turn("pages"))
            $(`.flipBook .p${props.noOfPages - 1}`).addClass("fixed");
          else $(`.flipBook .p${props.noOfPages - 1}`).removeClass("fixed");
        },

        turned: function(e: any, page: any, view: any) {
          const book = $(this);
          if (page == 2 || page == 3) {
            book.turn("peel", "br");
          }
          updateDepth(book);
          book.turn("center");
          props.setCurrentViews(view);
          props.setCurrentIndex(getViewNumber(book, page));
        },

        end: function(e: any, pageObj: any) {
          const book = $(this);
          updateDepth(book);
        }
      }
    });
    flipbook.addClass("animated");
    $("#canvas").css({ visibility: "" });
    props.setTotalViews(numberOfViews(flipbook));
  };

  useEffect(() => {
    $("#canvas").css({ visibility: "hidden" });
    setHeightAndWidthDynamically();
    initializeFlipBook();
  }, []);

  const classNameBack = `hard p${props.noOfPages} back-side-last`;
  const style = {
    backgroundSize: "contain",
    width: "100%",
    height: "100%"
  };
  const internalImageStyle = {
    backgroundSize: "contain",
    width: "100%",
    height: "100%"
  };
  const classNameBackFront = `hard fixed back-side p${props.noOfPages -
    1} back-side-end`;
  return (
    <div id={props.mobile ? "canvas-mobile" : "canvas"}>
      <div id="book-zoom">
        <div className="flipBook" id="flipBook">
          <div data-depth="5" className="hard">
            <img style={style} src={props.data.imageData[0].sliderImage} />
            <div className="side"></div>
          </div>
          <div data-depth="5" className="hard front-side">
            <img style={style} src={props.data.imageData[1].sliderImage} />
            <div className="shadow-pages-left"></div>
            <div className="depth"></div>
          </div>
          {props.data.imageData.map((imageData, index) => {
            if (index > 1 && index < props.noOfPages - 2) {
              if (index % 2 == 0) {
                return (
                  <div className="own-size even" key={index}>
                    <img
                      style={internalImageStyle}
                      src={imageData.sliderImage}
                    />
                    <div className="shadow-pages-right"></div>
                  </div>
                );
              } else
                return (
                  <div className="own-size" key={index}>
                    <img
                      style={internalImageStyle}
                      src={imageData.sliderImage}
                    />
                    <div className="shadow-pages-left"></div>
                  </div>
                );
            }
          })}
          <div className="own-size even"></div>
          <div className={classNameBackFront}>
            <img
              style={style}
              src={
                props.data.imageData[props.data.imageData.length - 2]
                  .sliderImage
              }
            />
            <div className="shadow-pages-right"></div>
            <div className="depth"></div>
          </div>
          <div className={classNameBack}>
            <img
              style={style}
              src={
                props.data.imageData[props.data.imageData.length - 1]
                  .sliderImage
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flipbook;
