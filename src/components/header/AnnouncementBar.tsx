import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import ReactHtmlParser from "react-html-parser";
import bridalRing from "../../images/bridal/rings.svg";

type Props = {
  clearBridalSession: (source: string) => void;
  isBridalRegistryPage: boolean;
};
const AnnouncementBar: React.FC<Props> = ({
  clearBridalSession,
  isBridalRegistryPage
}) => {
  const announcement = useSelector(
    (state: AppState) => state.header.announcementData
  );
  const messageText = announcement.message?.split("|");
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const animation = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex == messageText.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => {
      if (animation) {
        clearInterval(animation);
      }
    };
  }, []);
  return (
    <div
      className={styles.announcement}
      style={{
        backgroundColor:
          announcement.isBridalActive || isBridalRegistryPage
            ? announcement.bridalBgColorcode
            : announcement.bgColorcode
      }}
    >
      {announcement.url ? (
        <div
          key={currentIndex + "msgtext"}
          className={messageText.length > 1 ? styles.boxx1 : styles.width100}
        >
          <Link to={announcement.url ? "" + announcement.url : "/"}>
            <div id="announcement-bar-container">
              {ReactHtmlParser(messageText[currentIndex])}
            </div>
          </Link>
        </div>
      ) : (
        <div
          key={currentIndex + "msgtext"}
          className={messageText.length > 1 ? styles.boxx1 : styles.width100}
        >
          {isBridalRegistryPage || announcement.isBridalActive ? (
            <div>
              <>
                <svg
                  style={{ verticalAlign: "bottom" }}
                  viewBox="-5 -5 50 50"
                  width="30"
                  height="30"
                  preserveAspectRatio="xMidYMid meet"
                  x="0"
                  y="0"
                  className={styles.bridalRing}
                >
                  <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                </svg>{" "}
                {announcement.registrantName} & {announcement.coRegistrantName}
                &#39;s Bridal Registry (Public Link){" "}
                <b
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer"
                  }}
                >
                  <span
                    onClick={() =>
                      clearBridalSession(
                        location.pathname.includes("checkout")
                          ? "checkout"
                          : location.pathname.includes("cart")
                          ? "cart"
                          : ""
                      )
                    }
                  >
                    Close
                  </span>
                </b>
              </>
            </div>
          ) : (
            ReactHtmlParser(messageText[currentIndex])
          )}
        </div>
      )}
    </div>
  );
};

export default AnnouncementBar;
