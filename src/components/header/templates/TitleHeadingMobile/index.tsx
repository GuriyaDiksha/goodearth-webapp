import {
  MenuComponent,
  MenuComponentTitleData
} from "components/header/typings";
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles.scss";

type Props = {
  data: MenuComponent;
};
const TitleHeadingMobile: React.FC<Props> = ({ data }) => {
  const componentData = data.componentData as MenuComponentTitleData;
  return (
    <div className={styles.titleHeadingMobile}>
      <div className={styles.featuredMobileContainer}>
        {componentData.src && (
          <Link to={componentData.link}>
            <img className={styles.img} src={componentData.src} />
          </Link>
        )}
        <div className={styles.container}>
          <div className={styles.blockHeading}>
            <Link className={styles.heading} to={componentData.link}>
              {componentData.title}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleHeadingMobile;
