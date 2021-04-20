import {
  MenuComponent,
  MenuComponentTitleData
} from "components/header/typings";
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles.scss";
import Image from "./Image";

type Props = {
  data: MenuComponent;
};
const Title: React.FC<Props> = ({ data }) => {
  const componentData = data.componentData as MenuComponentTitleData;
  return (
    <>
      <div className={styles.blockTitle}>
        {componentData.link ? (
          <Link className={styles.title} to={componentData.link}>
            {componentData.title}
          </Link>
        ) : (
          <div className={styles.title}>{componentData.title}</div>
        )}
      </div>
      {data.children && data.children.length > 0 && (
        <Image data={data.children} />
      )}
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

export default Title;
