import React, { useState, useEffect } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { ShopLocatorProps } from "./typings";
import { Link } from "react-router-dom";
import cafeicon from "../../images/cafe-icon.svg";

const ShopPage: React.FC<ShopLocatorProps> = props => {
  const { data, mobile } = props;
  const [iframemap, setIframemap] = useState("");
  const [selectIndex, setSelectIndex] = useState(0);

  const onChange = (index: number) => {
    setIframemap(data[index]?.iframemap);
    setSelectIndex(index);
  };
  useEffect(() => {
    setIframemap(data?.[0].iframemap);
  }, [data]);
  return (
    <div className={bootstrapStyles.row}>
      <div
        className={cs(
          globalStyles.col12,
          globalStyles.colMd3,
          styles.shopAddresses
        )}
      >
        {data?.map((item: any, i: number) => {
          const viewLink =
            "/Cafe-Shop/" + item.city + "/" + item.place.replace(/\s/g, "_");
          return (
            <div
              className={cs(styles.shopAddBlock, styles.shopAddBlock1, {
                [styles.whiteBlock]: selectIndex == i
              })}
              onClick={() => {
                onChange(i);
              }}
              key={i}
            >
              <div className={cs(styles.serialNumber, styles.enabledSno)}>
                {i + 1}
              </div>
              {item.cafeAddress ? (
                <h3>
                  {item.place}{" "}
                  <Link to="#cafe">
                    {" "}
                    <img src={cafeicon} className={styles.iconCafe} />
                  </Link>{" "}
                </h3>
              ) : (
                ""
              )}
              <div className={cs(styles.small, styles.city)}>{item.city}</div>
              <div className={cs(styles.small, globalStyles.voffset3)}>
                <strong className="black"> {item.opendays} </strong> <br />
                {item.time}
              </div>
              <div className={cs(styles.small, globalStyles.voffset3)}>
                {item.address?.split(";").map((line: string, i: number) => {
                  return (
                    <div key={i} className={styles.small}>
                      {line}
                    </div>
                  );
                })}
              </div>
              <div className={cs(styles.small, globalStyles.voffset3)}>
                {item.tel1?.map((num: string, i: number) => {
                  if (mobile) {
                    const number = "tel:" + (num ? num.split("+")[1] : num);
                    return (
                      <div key={i}>
                        <a href={number} rel="noopener noreferrer">
                          {num}
                        </a>
                        <br />
                      </div>
                    );
                  } else {
                    return (
                      <div key={i}>
                        {num}
                        <br />
                      </div>
                    );
                  }
                })}
              </div>
              <div
                className={cs(
                  styles.viewDirectionsBlock,
                  globalStyles.row,
                  globalStyles.voffset3
                )}
              >
                <div className="col6">
                  <Link to={viewLink}> VIEW </Link>
                </div>
                <div className={cs(globalStyles.col6, globalStyles.textRight)}>
                  <Link to={item.direction} target="_blank">
                    directions{" "}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
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
          src={iframemap}
          scrolling="no"
          height="100%"
          width="100%"
        ></iframe>
      </div>
    </div>
  );
};

export default ShopPage;
