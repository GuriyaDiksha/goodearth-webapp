import React from "react";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import cs from "classnames";
import { PressStory } from "./typings";

type Props = {
  readMore: () => void;
  content: PressStory;
};

const ReadNext: React.FC<Props> = props => {
  const str =
    props.content.shortDesc
      .split(" ")
      .splice(0, 15)
      .join(" ") + "...";
  const publication = "| " + props.content.publication;
  return (
    <div
      className={cs(
        bootstrapStyles.row,
        globalStyles.voffset5,
        styles.mainBlock
      )}
      onClick={props.readMore}
    >
      <div
        className={cs(
          bootstrapStyles.colMd8,
          bootstrapStyles.offsetMd2,
          bootstrapStyles.col12,
          globalStyles.voffset5,
          styles.block
        )}
      >
        <div className={styles.block1}>
          <img src={props.content.thumbnail} className={styles.imgResponsive} />
        </div>
        <div className={styles.block2}>
          <div className={styles.heading}> {props.content.title}</div>
          <div className={styles.date}>
            {props.content.pubDate}{" "}
            <span className={styles.light}>
              {" "}
              {props.content.publication ? publication : ""}{" "}
            </span>
          </div>
          <div className={styles.para}>{str}</div>
          <div className={globalStyles.cursorPointer}>
            <a onClick={props.readMore}>read more</a>
          </div>
          <div className={styles.cLogo}>
            <img src={props.content.logo} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReadNext;
