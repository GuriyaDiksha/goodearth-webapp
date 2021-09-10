import React from "react";
import styles from "./styles.scss";
import Skeleton from "react-loading-skeleton";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

const SkeletonImage: React.FC<{}> = () => {
  const { mobile } = useSelector((state: AppState) => state.device);

  return (
    <div>
      <Skeleton duration={1} height={mobile ? 260 : 546} />
      <Skeleton style={{ marginTop: 20 }} />
      <div className={styles.secondheading}>
        <Skeleton />
      </div>
    </div>
  );
};

export default SkeletonImage;
