import React, { useEffect } from "react";
import { PressStory } from "./typings";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import cs from "classnames";

type Props = {
  data: PressStory;
  readMore: () => void;
};

const PressStoriesSubComponent: React.FC<Props> = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const str =
    props.data.shortDesc
      .split(" ")
      .splice(0, 15)
      .join(" ") + "...";
  const publication = "| " + props.data.publication;
  return (
    <div>
      <div className={cs(bootstrapStyles.row, styles.mainBlock)}>
        <div
          className={cs(
            bootstrapStyles.colMd10,
            bootstrapStyles.offsetMd1,
            bootstrapStyles.col12,
            styles.block
          )}
          onClick={props.readMore}
        >
          <div className={styles.block1}>
            <img src={props.data.thumbnail} className={styles.imgResponsive} />
          </div>
          <div className={styles.block2}>
            <div className={styles.heading}> {props.data.title}</div>
            <div className={styles.date}>
              {props.data.pubDate}{" "}
              <span className={globalStyles.cerise}>
                {" "}
                {props.data.publication ? publication : ""}{" "}
              </span>{" "}
            </div>
            <div className={styles.para}>{str}</div>
            <div className={globalStyles.pointer}>
              <a onClick={props.readMore}>read more</a>
            </div>
            <div className={styles.cLogo}>
              {props.data.logo ? <img src={props.data.logo} /> : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressStoriesSubComponent;
