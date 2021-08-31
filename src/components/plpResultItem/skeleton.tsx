import React from "react";
import styles from "./styles.scss";
import Skeleton from "react-loading-skeleton";

const SkeletonImage: React.FC<{}> = () => {
  return (
    <div>
      <Skeleton duration={1} height={546} />
      <Skeleton style={{ marginTop: 20 }} />
      <div className={styles.secondheading}>
        <Skeleton />
      </div>
    </div>
  );
};

export default SkeletonImage;
