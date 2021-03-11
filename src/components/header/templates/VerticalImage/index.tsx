import { MenuComponent } from "components/header/typings";
import React from "react";
import styles from "../styles.scss";
import Title from "../menuComponents/Title";

type Props = {
  data: MenuComponent;
};
const VerticalImage: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.verticalImage}>
      <Title data={data} />
    </div>
  );
};

export default VerticalImage;
