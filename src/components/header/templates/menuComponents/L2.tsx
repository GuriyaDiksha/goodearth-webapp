import {
  MenuComponent,
  MenuComponentL2L3Data
} from "components/header/typings";
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles.scss";
import L3 from "./L3";

type Props = {
  data: MenuComponent;
};
const L2: React.FC<Props> = ({ data }) => {
  const componentData = data.componentData as MenuComponentL2L3Data;
  return (
    <>
      {componentData.link ? (
        <Link className={styles.l2} to={componentData.link}>
          {componentData.text}
        </Link>
      ) : (
        <div className={styles.l2}>{componentData.text}</div>
      )}

      {data.children && data.children.length > 0 && <L3 data={data.children} />}
    </>
  );
};

export default L2;
