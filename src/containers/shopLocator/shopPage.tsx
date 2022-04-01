import React, { useState, useEffect } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { ShopLocatorProps } from "./typings";
import { Link } from "react-router-dom";
import cafeicon from "../../images/cafe-icon.svg";
import ReactHtmlParser from "react-html-parser";

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
          globalStyles.colLg3,
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
              {item.cafeAddress && (
                <Link to={`${viewLink}#cafe`}>
                  <img src={cafeicon} className={styles.iconCafe} />
                </Link>
              )}
              <div
                className={cs(styles.serialNumber, styles.enabledSno, {
                  [styles.bgCerise]: selectIndex == i
                })}
              >
                {i + 1}
              </div>
              <div className={cs(styles.shopInfoBlock)}>
                <h3>{ReactHtmlParser(item.place)}</h3>

                <div className={cs(styles.small, styles.city)}>
                  {ReactHtmlParser(item.city)}
                </div>
                <div className={cs(styles.small, globalStyles.voffset3)}>
                  <strong className={styles.black}>
                    {" "}
                    {ReactHtmlParser(item.opendays)}{" "}
                  </strong>{" "}
                  <br />
                  {ReactHtmlParser(item.time)}
                </div>
                <div className={cs(styles.small, globalStyles.voffset3)}>
                  {item.address?.split(";").map((line: string, i: number) => {
                    return (
                      <div key={i} className={styles.small}>
                        {ReactHtmlParser(line)}
                      </div>
                    );
                  })}
                </div>
                <div className={cs(styles.small, globalStyles.voffset3)}>
                  {item.tel1 && (
                    <div>
                      {ReactHtmlParser(item.tel1)}
                      <br />
                    </div>
                  )}
                </div>
                <div
                  className={cs(
                    styles.viewDirectionsBlock,
                    globalStyles.row,
                    globalStyles.voffset3
                  )}
                >
                  <div className={cs(globalStyles.col6, globalStyles.textLeft)}>
                    <Link to={viewLink}> VIEW </Link>
                  </div>
                  <div
                    className={cs(globalStyles.col6, globalStyles.textRight)}
                  >
                    <a
                      href={item.direction}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      directions{" "}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!mobile && (
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
      )}
    </div>
  );
};

export default ShopPage;
