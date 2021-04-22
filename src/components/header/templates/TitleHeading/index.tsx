import { MenuComponent } from "components/header/typings";
import React from "react";
import styles from "../styles.scss";
import Title from "../menuComponents/Title";

type Props = {
  data: MenuComponent;
};
const TitleHeading: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.titleHeading}>
      <Title data={data} />
    </div>
  );
};

export default TitleHeading;
