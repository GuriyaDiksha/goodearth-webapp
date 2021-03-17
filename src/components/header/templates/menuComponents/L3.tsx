import {
  MenuComponent,
  MenuComponentL2L3Data
} from "components/header/typings";
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles.scss";

type Props = {
  data: MenuComponent[];
};
const L3: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data.map((menuComponent, index) => {
        const componentData = menuComponent.componentData as MenuComponentL2L3Data;
        return (
          <div key={index} className={styles.block}>
            {" "}
            {componentData.link ? (
              <Link className={styles.l3} to={componentData.link}>
                {componentData.text}
              </Link>
            ) : (
              <div className={styles.l3}>{componentData.text}</div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default L3;
