import React from "react";
import styles from "./styles.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LazyImage from "components/LazyImage";

const Section2: React.FC = () => {
  const {
    home: { section2 },
    device: { mobile }
  } = useSelector((state: AppState) => state);

  const imagedata: any[] = [];
  if (section2.widgetImages) {
    section2.widgetImages.map((data: any) => {
      switch (data.order) {
        case 1:
        case 2:
        case 3: {
          if (data.imageType == 3) {
            imagedata.push(data);
          } else if (data.imageType == 2 && mobile) {
            imagedata.push(data);
          } else if (data.imageType == 1 && !mobile) {
            imagedata.push(data);
          }
          break;
        }
        default:
          break;
      }
    });
  }

  return (
    <section>
      <div className={cs(bootstrap.row, styles.sec4)}>
        {imagedata?.map((item: any, i: number) => {
          return (
            <div
              className={cs(
                bootstrap.colMd4,
                imagedata.length - 1 == i ? bootstrap.col12 : bootstrap.col6,
                styles.padd
              )}
            >
              <Link to={item.url} target={item.urlTab ? "_blank" : ""}>
                <LazyImage
                  src={item.image}
                  className={globalStyles.imgResponsive}
                  aspectRatio="0.83:1"
                  shouldUpdateAspectRatio={true}
                />
              </Link>
              <div className={styles.sec4Content}>
                <div className={styles.subtitle}>{item.title}</div>
                <div className={styles.title}>{item.subtitle}</div>
                <p>{item.description}</p>
                <div className={styles.ctaB2}>
                  {" "}
                  <Link to={item.ctaUrl} target={item.ctaTab ? "_blank" : ""}>
                    {" "}
                    {item.ctaText}{" "}
                  </Link>{" "}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Section2;
