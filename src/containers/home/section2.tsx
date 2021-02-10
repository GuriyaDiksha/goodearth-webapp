import React from "react";
import styles from "./styles.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

const Section2: React.FC = () => {
  const { section2 } = useSelector((state: AppState) => state.home);

  const imagedata = section2.widgetImages;

  return (
    <section>
      <div className={cs(bootstrap.row, styles.sec4)}>
        {imagedata?.map((item: any) => {
          return (
            <div className={cs(bootstrap.colMd4, bootstrap.col6, styles.padd)}>
              <a href={item.url}>
                <img src={item.image} className={globalStyles.imgResponsive} />
              </a>
              <div className={styles.sec4Content}>
                <div className={styles.subtitle}>{item.title}</div>
                <div className={styles.title}>{item.subtitle}</div>
                <p>{item.description}</p>
                <div className={styles.ctaB2}>
                  {" "}
                  <a href={item.ctaUrl}> {item.ctaText} </a>{" "}
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
