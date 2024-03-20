import React, { useContext } from "react";
import BridalContext from "./context";
import { AddressContext } from "components/Address/AddressMain/context";
import styles from "./styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import ReactHtmlParser from "react-html-parser";
import cs from "classnames";

const EditRegistryAddress: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { mode } = useContext(AddressContext);
  const { setCurrentScreenValue, setCurrentModule } = useContext(BridalContext);

  function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    setCurrentScreenValue("manage");
    setCurrentModule("created");
  }

  return (
    <div className={cs(bootstrapStyles.row, styles.spMobileVoffset6)}>
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          "checkout",
          styles.mobileContainer,
          {
            [cs(bootstrapStyles.colMd8, bootstrapStyles.offsetMd2)]:
              mode == "edit"
          },
          {
            [cs(bootstrapStyles.colMd10, bootstrapStyles.offsetMd1)]:
              mode !== "edit"
          }
        )}
      >
        <div className={cs(styles.backHead)}>
          <div className={cs(globalStyles.textLeft, styles.letterSpacing1)}>
            <span
              className={globalStyles.pointer}
              onClick={() => scrollToTop()}
            >
              {ReactHtmlParser(mode == "edit" ? "" : "&lt; &nbsp;BACK")}
            </span>
          </div>
          <div
            className={cs(
              globalStyles.textCenter,
              globalStyles.c22AI,
              styles.registryFormHeading
            )}
          >
            {mode == "edit" ? "Edit Address" : "Registry Shipping Address"}
          </div>
        </div>
        <div className={styles.registryFormSubheading}>
          Manage & edit your Registry shipping address.
        </div>
        {children}
        {/* <div
          className={cs(
            globalStyles.textCenter,
            globalStyles.cerise,
            globalStyles.voffset4,
            styles.letterSpacing1,
            styles.posUnset
          )}
        >
          <span className={globalStyles.pointer} onClick={() => scrollToTop()}>
            {ReactHtmlParser(
              mode == "edit" ? "" : "&lt; &nbsp;MANAGE REGISTRY"
            )}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default EditRegistryAddress;
