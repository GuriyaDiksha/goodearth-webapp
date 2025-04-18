import React, { useState, useContext, useEffect } from "react";
// import {render} from 'react-dom';
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'
import DatePicker from "react-datepicker";
// import DatePicker from 'react-date-picker';
// import { CalendarIcon, ClearIcon } from 'components/common/form/Calendar';
import moment from "moment";
// import { Props } from './typings';
import BridalContext from "./context";
import styles from "./styles.scss";
// import myAccountStyles from "../styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import calendarIcon from "../../../../images/bridal/icons_bridal-registry-calendar.svg";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../styles/reactDatepicker.css";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import Button from "components/Button";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const DateSelect: React.FC = () => {
  // const [data, setData ] = useState();

  const { setCurrentModule, setCurrentModuleData, data } = useContext(
    BridalContext
  );

  const [updateDate, setUpdateDate] = useState(data.eventDate ? true : false);
  // const [subscribe, setSubscribe ] = useState(false);
  const [
    isOpen
    // setIsOpen
  ] = useState(true);
  const [date, setDate] = useState(
    data.eventDate ? moment(data.eventDate, "YYYY-MM-DD").toDate() : undefined
  );
  const { mobile } = useSelector((state: AppState) => state.device);

  let pickerRef: any = null;
  const onChange = (date: Date) => {
    setDate(date);
    setUpdateDate(true);
  };

  const saveBridalDate = () => {
    setCurrentModule("details");
    setCurrentModuleData("date", {
      eventDate: moment(date).format("YYYY-MM-DD")
    });
  };

  const onClickBack = () => {
    setCurrentModule("create");
  };

  const OnOutsideClick = () => {
    pickerRef.setOpen(true);
  };

  useEffect(() => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "registry",
        "Event Category": "Registry",
        "Event Action": "Date selection page",
        "Event Label": data.occasion
      });
    }
  }, []);

  return (
    <>
      <div className={cs(bootstrapStyles.row, globalStyles.voffset5)}>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            globalStyles.textCenter
          )}
        >
          <i
            className={cs(styles.arrowUp, globalStyles.pointer)}
            onClick={onClickBack}
          ></i>
          <p className={styles.backGc}>
            <a onClick={onClickBack}>Back To Create Registry</a>{" "}
          </p>
        </div>
      </div>
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colMd8,
            bootstrapStyles.offsetMd2
          )}
        >
          <div className={cs(styles.gcHead, globalStyles.voffset4)}>
            2. SET THE DATE
          </div>

          <div
            className={cs(
              styles.loginForm,
              globalStyles.voffset4,
              globalStyles.textCenter
            )}
          >
            <form>
              <ul>
                <li className={globalStyles.relative}>
                  <DatePicker
                    startOpen={isOpen}
                    minDate={new Date()}
                    selected={date}
                    onChange={onChange}
                    ref={node => {
                      pickerRef = node;
                    }}
                    onClickOutside={OnOutsideClick}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                  />
                  <div className={styles.calendarIcon} onClick={OnOutsideClick}>
                    <img src={calendarIcon} width="45" height="45" />
                  </div>
                  {/* <DatePicker onChange={onChange}
                                                  value={date == ""? new Date(): (date == null ? null : new Date(date))}
                                                  dayPlaceholder="DD"
                                                  monthPlaceholder="MM"
                                                  yearPlaceholder="YYYY"
                                                  // formatLongDate={(locale, date) => formatDate(date, 'YYYY MMM dd')}
                                                  format="yyyy/MM/dd"
                                                  // defaultView="decade"
                                                  view="month"
                                                  id="date_of_registry"
                                                  isOpen={true}
                                                  // disabled={data.date_of_birth == ''?false:true}
                                                  activeStartDate={(date !== null && date !== "") ? new Date(date) : new Date()}
                                                  minDetail="month"
                                                  clearIcon={date == "" || date == null ? null: <ClearIcon />}
                                                  calendarIcon={<CalendarIcon />}
                                                  // maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 15))}
                                                  minDate={new Date()}
                                                  returnValue="start"
                                                  showLeadingZeros={true}/> */}
                </li>
                <li className={styles.blank}></li>
                <li>
                  <Button
                    type="button"
                    disabled={!updateDate || !date}
                    label="PROCEED TO FILL DETAILS"
                    onClick={saveBridalDate}
                    variant="mediumMedCharcoalCta366"
                  />
                </li>
              </ul>
            </form>
          </div>
        </div>
      </div>
      <div
        className={cs(
          bootstrapStyles.row,
          globalStyles.textCenter,
          globalStyles.voffset4
        )}
      >
        <div className={bootstrapStyles.col12}>
          {!updateDate || !date ? (
            <i className={styles.arrowDown}></i>
          ) : (
            <i
              className={cs(styles.arrowDown, globalStyles.pointer)}
              onClick={saveBridalDate}
            ></i>
          )}
        </div>
      </div>
    </>
  );
};

export default DateSelect;
