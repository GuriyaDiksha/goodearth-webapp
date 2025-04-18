import React, { useEffect } from "react";
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
// import { removeFroala } from "utils/validate";
import AnnouncementBarSlider from "./AnnouncementBarSlider";
import gift_icon_white from "../../images/registery/gift_icon_white.svg";

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
    coRegistrantName,
    occasionName,
    registryName
  } = useSelector((state: AppState) => state.header.announcementData);
  const { mobile } = useSelector((state: AppState) => state.device);
  const dispatch = useDispatch();
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [animation, setAnimation] = useState<null | NodeJS.Timeout>(null);
  useEffect(() => {
    // if (animation) {
    //   clearInterval(animation);
    // }
    // const newAnimation = setInterval(() => {
    //   setCurrentIndex(prevIndex =>
    //     prevIndex == data.length - 1 ? 0 : prevIndex + 1
    //   );
    //   removeFroala();
    // }, 4000);
    // setAnimation(newAnimation);
    // return () => {
    //   if (animation) {
    //     clearInterval(animation);
    //   }
    // };
  }, [data.length]);

  const openPopup = (popupData: PopupData) => {
    dispatch(updateComponent(POPUP.CMSPOPUP, popupData, true));
    dispatch(updateModal(true));
  };

  return (
    <div id="announcement_bar" className={styles.announcement}>
      <AnnouncementBarSlider
        dataLength={data?.length}
        isBridalPage={isBridalRegistryPage || isBridalActive}
      >
        {isBridalRegistryPage || isBridalActive ? (
          <div
            key={"msgtext"}
            className={
              data.length > 1 || !isBridalRegistryPage ? "" : styles.width100
            }
          >
            <div
              style={{
                backgroundColor: bridalBgColorcode
                  ? bridalBgColorcode
                  : "#9C7D50",
                height: "40px"
              }}
            >
              <>
                {/* <svg
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
                */}
                <div className={styles.flexDiv}>
                  <img src={gift_icon_white} width="25" alt="gift_reg_icon" />
                  &nbsp;
                  {registrantName && !coRegistrantName && (
                    <span>{registrantName}&#39;s</span>
                  )}
                  {registrantName && coRegistrantName && (
                    <span>
                      {registrantName}&nbsp;&&nbsp;{coRegistrantName}&#39;s
                    </span>
                  )}
                  &nbsp;{occasionName}
                  &nbsp;(Public Link)&nbsp;
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
                </div>
              </>
            </div>
          </div>
        ) : (
          data?.map((ele, index) => (
            <div
              key={index}
              className={
                data.length > 1 || !isBridalRegistryPage ? "" : styles.width100
              }
            >
              <div
                className={cs(
                  globalStyles.textCenter,
                  styles.announcementContainer
                )}
                style={{
                  background: `url(${
                    mobile ? ele?.mobilePatternImage : ele?.DesktopPatternImage
                  }) ${
                    isBridalActive || isBridalRegistryPage
                      ? bridalBgColorcode
                      : ele?.bgColorcode || bgColorcode
                  } ${ele?.patternRepeat ? "repeat" : "no-repeat"} center top`
                }}
              >
                {/* Announcement Bar Content */}
                <div className={styles.announcementContent}>
                  {ele?.announcementRedirection == "OPEN_A_POP_UP" ? (
                    <div
                      className={globalStyles.pointer}
                      onClick={() =>
                        openPopup(ele.announcementRedirectionPopup as PopupData)
                      }
                    >
                      {ReactHtmlParser(ele?.content)}
                    </div>
                  ) : ele?.announcementRedirectionUrl ? (
                    <a
                      href={ele?.announcementRedirectionUrl}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {ReactHtmlParser(ele?.content)}
                    </a>
                  ) : (
                    <div className={styles.noUrl}>
                      {ReactHtmlParser(ele?.content)}
                    </div>
                  )}
                </div>
                {/* CTA */}
                <div className={styles.announcementCta}>
                  {ele?.ctaLabel &&
                    (ele?.ctaRedirection == "OPEN_A_NEW_PAGE" ? (
                      <a
                        href={ele?.ctaRedirectionUrl}
                        rel="noreferrer noopener"
                        target="_blank"
                      >
                        <div
                          className={styles.announcementCtaBtn}
                          style={{
                            color: ele?.ctaBorderColor,
                            border: `1px solid ${ele?.ctaBorderColor}`
                          }}
                        >
                          {ReactHtmlParser(ele?.ctaLabel)}
                        </div>
                      </a>
                    ) : ele?.ctaRedirection == "OPEN_A_POP_UP" ? (
                      <div
                        className={styles.announcementCtaBtn}
                        /*style={{
                      color: data[currentIndex]?.ctaBorderColor,
                      border: `1px solid ${data[currentIndex]?.ctaBorderColor}`
                    }}*/
                        onClick={() =>
                          openPopup(ele?.ctaRedirectionPopup as PopupData)
                        }
                      >
                        {ReactHtmlParser(ele?.ctaLabel)}
                      </div>
                    ) : (
                      !ele?.ctaRedirection && (
                        <div
                          className={styles.announcementCtaBtn}
                          /*style={{
                        color: data[currentIndex]?.ctaBorderColor,
                        border: `1px solid ${data[currentIndex]?.ctaBorderColor}`
                      }}*/
                        >
                          {ReactHtmlParser(ele?.ctaLabel)}
                        </div>
                      )
                    ))}
                </div>
              </div>
            </div>
          ))
        )}
      </AnnouncementBarSlider>
    </div>
  );
};

export default AnnouncementBar;
