import React from "react";
import cs from "classnames";

import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import { Props, State } from "./typings";

export default class MyProfile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    props.setCurrentSection();
  }
  render() {
    return (
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colMd8,
            bootstrapStyles.offsetMd2
          )}
        >
          <div className={styles.formHeading}>My Profile</div>
          <div className={styles.formSubheading}>
            Manage your personal information and edit your email settings.
          </div>
        </div>
      </div>
    );
  }
}
