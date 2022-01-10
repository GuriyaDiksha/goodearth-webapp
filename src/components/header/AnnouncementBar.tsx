import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import ReactHtmlParser from "react-html-parser";
import bridalRing from "../../images/bridal/rings.svg";
import { PopupData } from "typings/api";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import { removeFroala } from "utils/validate";

type Props = {
  clearBridalSession: (source: string) => void;
  isBridalRegistryPage: boolean;
};
const AnnouncementBar: React.FC<Props> = ({
  clearBridalSession,
  isBridalRegistryPage
}) => {
  const {
    data,
    isBridalActive,
    bgColorcode,
    bridalBgColorcode,
    registrantName,
    coRegistrantName
  } = useSelector((state: AppState) => state.header.announcementData);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState<null | NodeJS.Timeout>(null);
  useEffect(() => {
    if (animation) {
      clearInterval(animation);
    }
    const newAnimation = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex == data.length - 1 ? 0 : prevIndex + 1
      );
      removeFroala();
    }, 4000);
    setAnimation(newAnimation);
    return () => {
      if (animation) {
        clearInterval(animation);
      }
    };
  }, [data.length]);

  const openPopup = (popupData: PopupData) => {
    dispatch(updateComponent(POPUP.CMSPOPUP, popupData, true));
    dispatch(updateModal(true));
  };

  return (
    <div
      className={styles.announcement}
      style={{
        backgroundColor:
          isBridalActive || isBridalRegistryPage
            ? bridalBgColorcode
            : data[0]?.bgColorcode || bgColorcode
      }}
    >
      <div
        key={currentIndex + "msgtext"}
        className={
          data.length > 1 || !isBridalRegistryPage
            ? styles.boxx1
            : styles.width100
        }
      >
        {isBridalRegistryPage || isBridalActive ? (
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
              {registrantName} & {coRegistrantName}
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
          <div
            className={cs(
              globalStyles.textCenter,
              styles.announcementContainer
            )}
          >
            {/* Announcement Bar Content */}
            <div className={styles.announcementContent}>
              {data[currentIndex]?.announcementRedirection ==
              "OPEN_A_NEW_PAGE" ? (
                <a
                  href={data[currentIndex]?.announcementRedirectionUrl}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {ReactHtmlParser(data[currentIndex]?.content)}
                </a>
              ) : data[currentIndex]?.announcementRedirection ==
                "OPEN_A_POP_UP" ? (
                <div
                  className={globalStyles.pointer}
                  onClick={() =>
                    openPopup(
                      data[currentIndex]
                        .announcementRedirectionPopup as PopupData
                    )
                  }
                >
                  {ReactHtmlParser(data[currentIndex]?.content)}
                </div>
              ) : (
                !data[currentIndex]?.announcementRedirection &&
                ReactHtmlParser(data[currentIndex]?.announcementRedirection)
              )}
            </div>
            {/* CTA */}
            <div className={styles.announcementCta}>
              {data[currentIndex]?.ctaLabel &&
                (data[currentIndex]?.ctaRedirection == "OPEN_A_NEW_PAGE" ? (
                  <a
                    href={data[currentIndex]?.ctaRedirectionUrl}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    <div
                      className={styles.announcementCtaBtn}
                      style={{
                        color: data[currentIndex]?.ctaBorderColor,
                        border: `1px solid ${data[currentIndex]?.ctaBorderColor}`
                      }}
                    >
                      {ReactHtmlParser(data[currentIndex]?.ctaLabel)}
                    </div>
                  </a>
                ) : data[currentIndex]?.ctaRedirection == "OPEN_A_POP_UP" ? (
                  <div
                    className={styles.announcementCtaBtn}
                    style={{
                      color: data[currentIndex]?.ctaBorderColor,
                      border: `1px solid ${data[currentIndex]?.ctaBorderColor}`
                    }}
                    onClick={() =>
                      openPopup(
                        data[currentIndex]?.ctaRedirectionPopup as PopupData
                      )
                    }
                  >
                    {ReactHtmlParser(data[currentIndex]?.ctaLabel)}
                  </div>
                ) : (
                  !data[currentIndex]?.ctaRedirection && (
                    <div
                      className={styles.announcementCtaBtn}
                      style={{
                        color: data[currentIndex]?.ctaBorderColor,
                        border: `1px solid ${data[currentIndex]?.ctaBorderColor}`
                      }}
                    >
                      {ReactHtmlParser(data[currentIndex]?.ctaLabel)}
                    </div>
                  )
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBar;
