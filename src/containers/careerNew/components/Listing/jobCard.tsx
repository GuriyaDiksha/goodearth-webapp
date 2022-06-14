import { Data } from "containers/careerNew/typings";
import React from "react";
import listing from "./listing.scss";

type Props = {
  job: Data;
};

const JobCard: React.FC<Props> = ({ job }) => {
  const { title, loc, summary } = job;

  return (
    <div className={listing.job_card_wrp}>
      <div className={listing.job_card_left_wrp}>
        <p className={listing.job_card_heading}>{title}</p>

        <p className={listing.job_card_location}>{loc}</p>
        <p className={listing.job_card_desc}>{summary}</p>
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
