import React, { Fragment, useLayoutEffect, useState } from "react";
import styles from "./styles.scss";
// import { useLocation } from "react-router";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

const Section3: React.FC = () => {
  //   const location = useLocation();
  const { section3 } = useSelector((state: AppState) => state.home);

  const imagedata = section3.widgetImages?.[0] || {};
  const bottemBanner = section3.widgetImages?.[1] || {};

  return (
    <Fragment>
      <section>
        <div className={bootstrap.row}>
          <div className={cs(bootstrap.colMd6, bootstrap.col12)}>
            <a href={imagedata.url}>
              <img
                src={imagedata.image}
                className={globalStyles.imgResponsive}
              />
            </a>
          </div>
          <div
            className={cs(
              bootstrap.colMd6,
              bootstrap.col12,
              styles.section3Content
            )}
          >
            <div className={cs(styles.content, styles.contentSpace)}>
              <div className={styles.subtitle}>{imagedata.title}</div>
              <div className={styles.title}>{imagedata.subtitle}</div>
              <p>{imagedata.description}</p>
              <a href={imagedata.ctaUrl}>
                {" "}
                <div className={cs(styles.ctaB1, styles.ctaMargin)}>
                  {" "}
                  {imagedata.ctaText}{" "}
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={cs(styles.b1, styles.bgb1)}>
          <a href={bottemBanner.url}>
            <img
              src={bottemBanner.image}
              className={globalStyles.imgResponsive}
            />
          </a>
          <div className={styles.bottemBanner}>
            <div className={styles.subtitle}>{bottemBanner.title}</div>
            <div className={styles.title}>{bottemBanner.subtitle}</div>
            <p>{bottemBanner.description}</p>
            <a href={bottemBanner.ctaUrl}>
              <div className={styles.ctaBottom}>{bottemBanner.ctaText} </div>
            </a>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Section3;
