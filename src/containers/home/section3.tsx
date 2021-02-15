import React, { Fragment } from "react";
import styles from "./styles.scss";
// import { useLocation } from "react-router";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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
            <Link to={imagedata.url}>
              <img
                src={imagedata.image}
                className={globalStyles.imgResponsive}
              />
            </Link>
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
              <Link to={imagedata.ctaUrl}>
                {" "}
                <div className={cs(styles.ctaB1, styles.ctaMargin)}>
                  {" "}
                  {imagedata.ctaText}{" "}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className={cs(styles.b1, styles.bgb1)}>
          <Link to={bottemBanner.url}>
            <img
              src={bottemBanner.image}
              className={globalStyles.imgResponsive}
            />
          </Link>
          <div className={styles.bottemBanner}>
            <div className={styles.subtitle}>{bottemBanner.title}</div>
            <div className={styles.title}>{bottemBanner.subtitle}</div>
            <p>{bottemBanner.description}</p>
            <Link to={bottemBanner.ctaUrl}>
              <div className={styles.ctaBottom}>{bottemBanner.ctaText} </div>
            </Link>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Section3;
