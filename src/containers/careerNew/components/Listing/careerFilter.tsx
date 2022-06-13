import React from "react";
import listing from "./listing.scss";

const CareerFilter: React.FC = () => {
  return (
    <>
      <ul>
        <li className={listing.filter_li}>
          <span className={listing.filter_label}>By Department</span>
          <hr className={listing.filter_label_underline} />
          <div className={listing.filters_wrp}>
            <ul>
              <li className={listing.filter_tag_wrp}>
                <div className={listing.filter_tag}>
                  Store Managment<span className={listing.close_btn}>x</span>
                </div>
                <div className={listing.filter_tag}>
                  Merchandising<span className={listing.close_btn}>x</span>
                </div>
                <div className={listing.filter_tag}>
                  Mumbai<span className={listing.close_btn}>x</span>
                </div>
              </li>
              <li>
                <button className={listing.see_more_btn}>Clear All</button>
              </li>
            </ul>
          </div>
        </li>

        <li className={listing.filter_li}>
          <span className={listing.filter_label}>By Department</span>
          <hr className={listing.filter_label_underline} />
          <div className={listing.filters_wrp}>
            <ul>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <button className={listing.see_more_btn}>+ Show More</button>
              </li>
            </ul>
          </div>
        </li>

        <li className={listing.filter_li}>
          <span className={listing.filter_label}>By Department</span>
          <hr className={listing.filter_label_underline} />
          <div className={listing.filters_wrp}>
            <ul>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <button className={listing.see_more_btn}>+ Show More</button>
              </li>
            </ul>
          </div>
        </li>

        <li className={listing.filter_li}>
          <span className={listing.filter_label}>By Department</span>
          <hr className={listing.filter_label_underline} />
          <div className={listing.filters_wrp}>
            <ul>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <input id="1" type="checkbox" name="View All" />
                <label htmlFor={"1"}>View All</label>
              </li>
              <li>
                <button className={listing.see_more_btn}>+ Show More</button>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <div className={listing.filter_mobile_button}>
        <button className={listing.cancel_btn}>Cancel</button>
        <button className={listing.apply_btn}>Apply filter</button>
      </div>
    </>
  );
};

export default CareerFilter;
