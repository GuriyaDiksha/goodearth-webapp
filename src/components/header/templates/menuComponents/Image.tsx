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
            <div className={styles.container}>
              <div className={styles.block}>
                <Link className={styles.heading} to={componentData.link}>
                  {componentData.heading}
                </Link>
              </div>
              <Link className={styles.subheading} to={componentData.link}>
                {componentData.subHeading}
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className={styles.imgContainer}>
              <img className={styles.img} src={componentData.src} />
            </div>
            <div className={styles.container}>
              <div className={styles.block}>
                <div className={styles.heading}>{componentData.heading}</div>
              </div>
              <div className={styles.subheading}>
                {componentData.subHeading}
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

export default Image;
