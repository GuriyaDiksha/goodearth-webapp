import React, { Fragment } from "react";
import styles from "./styles.scss";
// import { useLocation } from "react-router";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LazyImage from "components/LazyImage";

const Section3: React.FC = () => {
  //   const location = useLocation();
  const {
    home: { section3 },
    device: { mobile }
  } = useSelector((state: AppState) => state);

  let imagedata: any = {};
  let bottemBanner: any = {};

  if (section3.widgetImages) {
    section3.widgetImages.map((data: any) => {
      switch (data.order) {
        case 1: {
          if (data.imageType == 3) {
            imagedata = data;
          } else if (data.imageType == 2 && mobile) {
            imagedata = data;
          } else if (data.imageType == 1 && !mobile) {
            imagedata = data;
          }
          break;
        }
        case 2:
          {
            if (data.imageType == 3) {
              bottemBanner = data;
            } else if (data.imageType == 2 && mobile) {
              bottemBanner = data;
            } else if (data.imageType == 1 && !mobile) {
              bottemBanner = data;
            }
          }
          break;
        default:
          break;
      }
    });
  }

  return (
    <Fragment>
      <section>
        <div className={bootstrap.row}>
          <div className={cs(bootstrap.colMd6, bootstrap.col12)}>
            <Link to={imagedata.url}>
              <LazyImage
                src={imagedata.image}
                className={globalStyles.imgResponsive}
                aspectRatio="0.95:1"
                shouldUpdateAspectRatio={true}
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
                <div className={cs(styles.ctaSection5)}>
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
            <LazyImage
              src={bottemBanner.image}
              className={globalStyles.imgResponsive}
              aspectRatio="2.1:1"
              shouldUpdateAspectRatio={true}
            />
          </Link>
          <div className={styles.bottemBanner}>
            <div className={styles.title}>{bottemBanner.title}</div>
            <div className={styles.subtitle}>{bottemBanner.subtitle}</div>
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
