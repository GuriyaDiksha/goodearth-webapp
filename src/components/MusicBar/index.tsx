import React, { memo } from "react";
// import cs from "classnames";

import styles from "./styles.scss";

const MusicPlayer: React.FC = memo(() => {
  return (
    <div className={styles.music}>
      <div>
        <div className={styles.openMusic}>
          <label className={styles.label1}>
            <input
              type="checkbox"
              className={styles.toggelInput}
              name="toggleMusic"
              id="toggleMusic"
              checked
            />
            <label htmlFor="toggleMusic" className={styles.toggelMenu}></label>
          </label>
        </div>
      </div>
    </div>
  );
});

export default MusicPlayer;
