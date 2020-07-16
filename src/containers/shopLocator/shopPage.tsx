import React from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { ShopLocatorProps } from "./typings";
import { Link } from "react-router-dom";

const ShopPage: React.FC<ShopLocatorProps> = props => {
  return (
    <div className={bootstrapStyles.row}>
      <div
        className={cs(
          globalStyles.col12,
          globalStyles.colMd3,
          styles.shopAddresses
        )}
      >
        <div
          className={cs(
            styles.shopAddBlock,
            styles.shopAddBlock1,
            styles.whiteBlock
          )}
        >
          <div className={cs(styles.serialNumber, styles.enabledSno)}>1</div>
          <h3>
            Khan Market{" "}
            <Link to="#cafe">
              {" "}
              <img src="/" className="iconCafe" />{" "}
            </Link>{" "}
          </h3>
          <div className={cs(styles.small, styles.city)}>Delhi</div>
          <div className={cs(styles.small, globalStyles.voffset3)}>
            <strong className="black"> OPEN 7 DAYS A WEEK </strong> <br />
            11:00am - 5:00pm IST
          </div>
          <div className={cs(styles.small, globalStyles.voffset3)}>
            Shop directly with -
          </div>
          <div className={styles.small}>Shashi Raman +91 9818339477</div>
          <div className={cs(styles.small, globalStyles.voffset3)}>
            +91-11-24647175
            <br /> +91-11-24647176
            <br /> +91-11-24647179
          </div>
          <div
            className={cs(
              styles.viewDirectionsBlock,
              globalStyles.row,
              globalStyles.voffset3
            )}
          >
            <div className="col6">
              <Link to=""> VIEW </Link>
            </div>
            <div className={cs(globalStyles.col6, globalStyles.textRight)}>
              <Link
                to="https://www.google.com/maps/dir//28.599641,77.226376/@28.599641,77.226376,16z?hl=en-GB"
                target="_blank"
              >
                directions{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cs(
          globalStyles.col12,
          globalStyles.colMd9,
          globalStyles.pullRight,
          styles.ht100vh
        )}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7006.00905424862!2d77.226376!3d28.599641!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xeb0accce6f3226e8!2sGood+Earth!5e0!3m2!1sen!2sin!4v1540965321199"
          scrolling="no"
          height="100%"
          width="100%"
        ></iframe>
      </div>
    </div>
  );
};

export default ShopPage;
