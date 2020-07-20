import React, { useState, useContext } from "react";
// import {render} from 'react-dom';
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'
import DatePicker from "react-datepicker";
// import DatePicker from 'react-date-picker';
// import { CalendarIcon, ClearIcon } from 'components/common/form/Calendar';
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
// import { Props } from './typings';
import BridalContext from "./context";

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
    data.eventDate ? moment(data.eventDate, "DD-MM-YYYY") : ""
  );

  let pickerRef: any = null;
  const todaydate = moment().toDate();

  const onChange = (date: Date) => {
    setDate(moment(date));
    setUpdateDate(true);
  };

  const saveBridalDate = () => {
    setCurrentModule("details");
    setCurrentModuleData("date", {
      eventDate: moment(date).format("DD-MM-YYYY")
    });
  };

  const onClickBack = () => {
    setCurrentModule("create");
  };

  const OnOutsideClick = () => {
    pickerRef.setOpen(true);
  };

  return (
    <section className="gc paddTop-80">
      <div className="row">
        <div className="col-md-6 col-md-offset-3 col-xs-12 text-center popup-form-bg">
          <div className="row voffset5">
            <div className="col-xs-10 col-xs-offset-1 text-center">
              <i className="arrow-up cursor-pointer" onClick={onClickBack}></i>
              <p className="back-gc">
                <a onClick={onClickBack}>Back To Create Registry</a>{" "}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2">
              <div className="gc-head voffset4">2. SET THE DATE</div>

              <div className="login-form voffset4 text-center">
                <form>
                  <ul className="categorylabel">
                    <li>
                      <DatePicker
                        startOpen={isOpen}
                        minDate={todaydate as Date}
                        selected={moment(date).toDate()}
                        onChange={onChange}
                        ref={node => {
                          pickerRef = node;
                        }}
                        onClickOutside={OnOutsideClick}
                        className="input-style"
                        dateFormat="DD/MM/YYYY"
                        placeholderText="DD/MM/YYYY"
                      />
                      <div className="calendar-icon" onClick={OnOutsideClick}>
                        <img
                          src="/static/img/bridal/icons_bridal-registry-calendar.svg"
                          width="45"
                          height="45"
                        />
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
                    <li className="blank"></li>
                    <li>
                      <input
                        type="button"
                        disabled={!updateDate || !date}
                        className={
                          updateDate && date
                            ? "cerise-btn"
                            : "cerise-btn disabled-btn"
                        }
                        value="PROCEED TO FILL DETAILS"
                        onClick={saveBridalDate}
                      />
                    </li>
                  </ul>
                </form>
              </div>
            </div>
          </div>
          <div className="row text-center voffset4">
            <div className="col-xs-12">
              {!updateDate || !date ? (
                <i className="arrow-down"></i>
              ) : (
                <i
                  className="arrow-down cursor-pointer"
                  onClick={saveBridalDate}
                ></i>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DateSelect;
