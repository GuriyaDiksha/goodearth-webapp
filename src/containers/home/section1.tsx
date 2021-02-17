import React, { Fragment } from "react";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { Link } from "react-router-dom";
import Button from "containers/home/Button";

const Section1: React.FC = () => {
  const {
    home: { section1 },
    device: { mobile }
  } = useSelector((state: AppState) => state);
  let banner: any = {};
  const image: any[] = [];
  const motive: any[] = [];
  if (section1.widgetImages) {
    section1.widgetImages.map((data: any) => {
      switch (data.order) {
        case 1: {
          if (data.imageType == 3) {
            banner = data;
          } else if (data.imageType == 2 && mobile) {
            banner = data;
          } else if (data.imageType == 1 && !mobile) {
            banner = data;
          }
          break;
        }
        case 2:
        case 3:
          {
            if (data.imageType == 3) {
              image.push(data);
            } else if (data.imageType == 2 && mobile) {
              image.push(data);
            } else if (data.imageType == 1 && !mobile) {
              image.push(data);
            }
          }
          break;
        case 4:
        case 5:
        case 6:
          motive.push(data);
          break;
        default:
          break;
      }
    });
  }

  const imagedata1 = image?.[0] || {};
  const imagedata2 = image?.[1] || {};

  return (
    <Fragment>
      <section>
        <div className={styles.b1}>
          <Link to={banner.url}>
            <img src={banner.image} className={globalStyles.imgResponsive} />
          </Link>
          <div className={styles.contentB1}>
            <div className={styles.subtitle}>{banner.title}</div>
            <div className={styles.title}>{banner.subtitle}</div>
            <p>{banner.description}</p>
            <Link to={banner.ctaUrl}>
              {" "}
              <div className={cs(styles.ctaB1, styles.ctaMargin)}>
                <Button value={banner.ctaText} onClick={() => null} />
                {/* {banner.ctaText}{" "} */}
              </div>
            </Link>
          </div>
        </div>
      </section>
      <section>
        <div className={cs(styles.b2, styles.bgImg)}>
          <div className={cs(bootstrap.row)}>
            <div className={cs(bootstrap.col6)}>
              <Link to={imagedata1.url}>
                <img
                  src={imagedata1.image}
                  className={globalStyles.imgResponsive}
                />
              </Link>
              <div className={styles.contentB2}>
                <div className={styles.title}>{imagedata1.title}</div>
                <p>{imagedata1.description}</p>
                <div className={styles.ctaB2}>
                  {" "}
                  <Link to={imagedata1.ctaUrl}>
                    {" "}
                    {imagedata1.ctaText}{" "}
                  </Link>{" "}
                </div>
              </div>
            </div>
            <div className={cs(bootstrap.col6)}>
              <Link to={imagedata2.url}>
                <img
                  src={imagedata2.image}
                  className={globalStyles.imgResponsive}
                />
              </Link>
              <div className={styles.contentB2R}>
                <div className={styles.title}>{imagedata2.title}</div>
                <p>{imagedata2.description}</p>
                <div className={styles.ctaB2}>
                  {" "}
                  <Link to={imagedata2.ctaUrl}> {imagedata2.ctaText} </Link>
                </div>
              </div>
            </div>
          </div>
          <div className={bootstrap.row}>
            {motive?.map((item: any, i: number) => {
              return (
                <div
                  className={cs(
                    bootstrap.col6,
                    bootstrap.colMd4,
                    globalStyles.textCenter
                  )}
                  key={i}
                >
                  <img src={item.image} width="40%" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Section1;
