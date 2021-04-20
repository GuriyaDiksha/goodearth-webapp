import { MenuComponent } from "components/header/typings";
import React from "react";
import styles from "../styles.scss";
import Image from "../menuComponents/Image";

type Props = {
  data: MenuComponent;
};
const ImageWithSideSubheadingMobile: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.imageWithSideSubheadingMobile}>
      {data.children && data.children.length > 0 && (
        <Image data={data.children} />
      )}
    </div>
  );
};

export default ImageWithSideSubheadingMobile;
