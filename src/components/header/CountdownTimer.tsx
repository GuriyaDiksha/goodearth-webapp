import React, { useEffect, useState } from "react";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import ReactHtmlParser from "react-html-parser";
import { Link } from "react-router-dom";
import cs from "classnames";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const CountdownTimer: React.FC = () => {
  const { timerData } = useSelector((state: AppState) => state.header);
  if (!timerData) return null;
  const {
    themeColorHexCode,
    ctaText,
    ctaUrl,
    text,
    saleEndDate,
    saleStartDate
  } = timerData;
  const timerColor = themeColorHexCode || "#ab1e56";
  const timerStartDate = new Date(saleStartDate);
  const timerEndDate = new Date(saleEndDate);
  const currentDate = new Date();
  if (timerStartDate > currentDate) return null;
  if (timerEndDate < currentDate) return null;

  const timeLeft = Math.floor(
    (timerEndDate.getTime() - currentDate.getTime()) / 1000
  );
  const [day, setDay] = useState(Math.floor(timeLeft / (3600 * 24)));
  const [hr, setHr] = useState(Math.floor((timeLeft % (3600 * 24)) / 3600));
  const [min, setMin] = useState(Math.floor((timeLeft % 3600) / 60));
  const [sec, setSec] = useState(Math.floor(timeLeft % 60));

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = Math.floor(
        (timerEndDate.getTime() - new Date().getTime()) / 1000
      );
      if (timeLeft >= 0) {
        const newDay = Math.floor(timeLeft / (3600 * 24));
        const newHr = Math.floor((timeLeft % (3600 * 24)) / 3600);
        const newMin = Math.floor((timeLeft % 3600) / 60);
        const newSec = Math.floor(timeLeft % 60);
        setDay(newDay);
        setHr(newHr);
        setMin(newMin);
        setSec(newSec);
      } else {
        clearInterval(timer);
        window.location.href = "/";
      }
    }, 1000);
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  return (
    <div id="ge-timer" className={styles.countdownTimer}>
      <div className={bootstrap.row}>
        <div
          className={cs(
            bootstrap.col,
            bootstrap.colLg2,
            bootstrap.offsetLg3,
            styles.timerTxt
          )}
          style={{ color: timerColor }}
        >
          {ReactHtmlParser(text)}
        </div>
        <div
          className={cs(bootstrap.col, bootstrap.colLg2, styles.timer)}
          style={{ color: timerColor }}
        >
          <table>
            <tr className={styles.timerValue}>
              <td>
                {day.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
              </td>
              <td>:</td>
              <td>
                {hr.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
              </td>
              <td>:</td>
              <td>
                {min.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
              </td>
              <td>:</td>
              <td>
                {sec.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
              </td>
            </tr>
            <tr className={styles.timerLabel}>
              <td>DAY</td>
              <td></td>
              <td>HR</td>
              <td></td>
              <td>MIN</td>
              <td></td>
              <td>SEC</td>
            </tr>
          </table>
        </div>
        <div className={cs(bootstrap.col, bootstrap.colLg2)}>
          <Link to={ctaUrl}>
            <div
              className={styles.timerCtaBtn}
              style={{ color: timerColor, border: `1px solid ${timerColor}` }}
            >
              {ReactHtmlParser(ctaText)}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default CountdownTimer;
