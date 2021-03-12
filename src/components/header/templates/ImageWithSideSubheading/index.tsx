import { MenuComponent } from "components/header/typings";
import React from "react";
import styles from "../styles.scss";
import Title from "../menuComponents/Title";

type Props = {
  data: MenuComponent;
};
const ImageWithSideSubheading: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.imageWithSideSubheading}>
      <Title data={data} />
    </div>
  );
};

export default ImageWithSideSubheading;
