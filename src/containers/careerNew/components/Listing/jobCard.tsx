import React from "react";
import listing from "./listing.scss";

const JobCard: React.FC = () => {
  return (
    <div className={listing.job_card_wrp}>
      <div className={listing.job_card_left_wrp}>
        <p className={listing.job_card_heading}>Marketing Manager</p>

        <p className={listing.job_card_location}>Delhi, Remote Working</p>
        <p className={listing.job_card_desc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <button className={listing.job_card_apply_btn}>
          read more & apply
        </button>
      </div>
      <div className={listing.job_card_right_wrp}>
        <p className={listing.job_card_share_heading}>share</p>
        <ul>
          <li>
            <a className={listing.icon_wrp}>C</a>
            <a className={listing.icon_wrp}>E</a>
            <a className={listing.icon_wrp}>F</a>
            <a className={listing.icon_wrp}>L</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default JobCard;
