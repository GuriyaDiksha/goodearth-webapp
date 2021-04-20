import {
  MenuComponent,
  MenuComponentL2L3Data
} from "components/header/typings";
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles.scss";
import L3 from "./L3";

type Props = {
  data: MenuComponent;
};
const L2: React.FC<Props> = ({ data }) => {
  const componentData = data.componentData as MenuComponentL2L3Data;
  return (
    <>
      <div className={styles.blockL2}>
        {componentData.link ? (
          <>
            <Link className={styles.l2} to={componentData.link}>
              {componentData.text}
            </Link>
            {componentData.src && (
              <Link to={componentData.link}>
                <img className={styles.img} src={componentData.src} />
              </Link>
            )}
          </>
        ) : (
          <>
            <div className={styles.l2}>{componentData.text}</div>
            {componentData.src && (
              <div className={styles.imgContainer}>
                <img className={styles.img} src={componentData.src} />
              </div>
            )}
          </>
        )}
      </div>

      {data.children && data.children.length > 0 && <L3 data={data.children} />}
      <div className={styles.blockCta}>
        {componentData.link ? (
          <Link className={styles.cta} to={componentData.link}>
            {componentData.ctaName}
          </Link>
        ) : (
          <div className={styles.cta}>{componentData.ctaName}</div>
        )}
      </div>
    </>
  );
};

export default L2;
