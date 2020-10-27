import React from "react";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import motifTigerTree from "../../images/motifTigerTree.png";
import { Link } from "react-router-dom";
import gelogoCerise from "../../images/gelogoCerise.svg";

class ErrorPage extends React.Component<{}, {}> {
  getItems() {
    return (
      <div className={styles.cart}>
        {/* {this.renderMessage()} */}
        <div
          className={cs(
            globalStyles.marginT40,
            globalStyles.textCenter,
            bootstrap.colMd4,
            bootstrap.offsetMd4,
            bootstrap.colSm8,
            bootstrap.offsetSm2,
            bootstrap.col10,
            bootstrap.offset1
          )}
        >
          <div className={cs(styles.emptyMsg, globalStyles.cerise)}>
            {" "}
            The link has expired{" "}
          </div>
          <div className={cs(globalStyles.voffset3, globalStyles.c10LR)}>
            {" "}
            Please contact customer care to renue your order link{" "}
          </div>
          <div className={globalStyles.voffset5}>
            {" "}
            <Link to="/">
              <button className={globalStyles.ceriseBtn}>
                CONTINUE SHOPPING
              </button>
            </Link>{" "}
          </div>
          <div className={globalStyles.voffset5}>
            {" "}
            <img src={motifTigerTree} />{" "}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <div className={cs(styles.headerContainer)}>
          <div className={cs(bootstrap.row, styles.minimumWidth)}>
            <div
              className={cs(
                bootstrap.colMd2,
                bootstrap.col5,
                styles.logoContainer
              )}
            >
              <Link to="/">
                <img className={styles.logo} src={gelogoCerise} />
              </Link>
            </div>
          </div>
        </div>
        <div className={cs(bootstrap.row, styles.pageBody)}>
          <div
            className={cs(
              bootstrap.col12,
              bootstrap.colMd12,
              styles.bagContents
            )}
          >
            {this.getItems()}
          </div>
        </div>
      </>
    );
  }
}

export default ErrorPage;
