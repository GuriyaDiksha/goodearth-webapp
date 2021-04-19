import { MenuComponent } from "components/header/typings";
import React from "react";
import styles from "../styles.scss";
import L2 from "../menuComponents/L2";

type Props = {
  data: MenuComponent;
};
const L2L3: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.l2l3}>
      <L2 data={data} />
    </div>
  );
};

export default L2L3;
