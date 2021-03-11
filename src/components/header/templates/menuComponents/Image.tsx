import {
  MenuComponent,
  MenuComponentImageData
} from "components/header/typings";
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles.scss";

type Props = {
  data: MenuComponent[];
};
const Image: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.map(menuComponent => {
        const componentData = menuComponent.componentData as MenuComponentImageData;
        return componentData.link ? (
          <>
            <Link to={componentData.link}>
              <img className={styles.img} src={componentData.src} />
            </Link>
            <Link className={styles.heading} to={componentData.link}>
              {componentData.heading}
            </Link>
            <Link className={styles.subheading} to={componentData.link}>
              {componentData.subHeading}
            </Link>
          </>
        ) : (
          <>
            <div>
              <img className={styles.img} src={componentData.src} />
            </div>
            <div className={styles.heading}>{componentData.heading}</div>
            <div className={styles.subheading}>{componentData.subHeading}</div>
          </>
        );
      })}
    </>
  );
};

export default Image;
