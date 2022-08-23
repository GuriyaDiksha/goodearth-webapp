import React, { useState, useEffect } from "react";
import cs from "classnames";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Section1Props } from "./typings";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const Section1: React.FC<Section1Props> = props => {
  let imageName = "image0";
  if (props.data.imageUrl) {
    const index = props.giftimages.indexOf(props.data.imageUrl);
    if (index > -1) imageName = "image" + index;
  }
  const [selected, setSelected] = useState(imageName);
  const [selectindex, setSelectindex] = useState(0);
  const { mobile } = useSelector((state: AppState) => state.device);
  const { tablet } = useSelector((state: AppState) => state.device);
  const { showTimer } = useSelector((state: AppState) => state.info);
  const selectImage = (index: number) => {
    setSelected("image" + index);
    setSelectindex(index);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const gotoNext = () => {
    // document.cookie = "giftcard_image=" + this.state.giftimages[this.state.selectindex] + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    props.next(props.giftimages[selectindex], "amount");
  };

  return (
    <div className={bootstrapStyles.row}>
      <section
        className={cs(
          globalStyles.paddTop60,
          styles.gc,
          { [styles.gcTimer]: showTimer },
          bootstrapStyles.col12,
          {
            [styles.gcMobile]: mobile,
            [styles.gcMobileTimer]: mobile && showTimer
          },
          { [styles.gcNoPad]: mobile || tablet }
        )}
      >
        <div className={bootstrapStyles.row}>
          <div
            className={cs(
              bootstrapStyles.col6,
              { [bootstrapStyles.offset3]: !mobile },
              { [styles.gcMargin]: mobile },
              { [styles.gcMinWidth]: mobile },
              globalStyles.textCenter,
              styles.txtSettings,
              { [styles.txtSettingsMobile]: mobile }
            )}
          >
            <h2> Gifting With E-cards </h2>
            <p className={styles.clrP}>
              For this season, we’re celebrating a splendorous forest with our
              theme Van Vaibhav, and have three enchanting E-Gift Card designs
              to personalize and gift your loved ones.
            </p>
            <p className={styles.clrP}>
              Select a design and denomination from below, fill in the required
              information and add it to the cart.
            </p>
            <p className={styles.clrP}>
              After you check out, your E-Gift Card will automatically be
              emailed to the recipient, and ready for them to use.
            </p>
          </div>
          <div className={bootstrapStyles.col12}>
            <div
              className={cs(
                bootstrapStyles.col10,
                bootstrapStyles.offset1,
                globalStyles.textCenter,
                globalStyles.voffset4
              )}
            >
              <div className={styles.gcHead}> 1. Pick a design</div>
            </div>
          </div>
          <div className={bootstrapStyles.col12}>
            <div className={bootstrapStyles.row}>
              <div
                className={cs(
                  bootstrapStyles.col10,
                  bootstrapStyles.offset1,
                  bootstrapStyles.colLg8,
                  bootstrapStyles.offsetLg2,
                  globalStyles.textCenter,
                  globalStyles.paddTop40
                )}
              >
                <div className={bootstrapStyles.row}>
                  {props.giftimages.map((data: any, i: number) => {
                    return (
                      <div
                        key={i}
                        className={cs(
                          bootstrapStyles.col12,
                          bootstrapStyles.colLg4
                        )}
                        onClick={() => {
                          selectImage(i);
                        }}
                      >
                        <div className={cs({ [styles.marginX15]: !mobile })}>
                          <img
                            alt="giftcard-image"
                            src={data}
                            className={
                              selected == "image" + i
                                ? cs(styles.cardImg, styles.cardImgHover)
                                : styles.cardImg
                            }
                          />
                          <br />
                          <div className={globalStyles.marginB10}>
                            <input
                              type="radio"
                              id={"image" + i}
                              name="radio-group"
                              onChange={() => {
                                selectImage(i);
                              }}
                              checked={selected == "image" + i}
                            />
                            <label htmlFor={"image" + i}></label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div
            className={cs(bootstrapStyles.col12, styles.buttonRow, {
              [styles.buttonSticky]: mobile || tablet
            })}
          >
            <div className={cs(styles.imageSelectBtnContainer)}>
              <button
                className={cs(styles.imageSelectBtn, {
                  [styles.mobileFullWidthButton]: mobile || tablet
                })}
                onClick={gotoNext}
              >
                Confirm & Choose Value&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Section1;
