import { MenuComponent } from "components/header/typings";
import React from "react";
import styles from "../styles.scss";
import Title from "../menuComponents/Title";

type Props = {
  data: MenuComponent;
};
const Content: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.content}>
      <Title data={data} />
    </div>
  );
};

export default Content;
