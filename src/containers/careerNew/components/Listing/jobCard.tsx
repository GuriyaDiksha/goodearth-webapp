import { Data } from "containers/careerNew/typings";
import React from "react";
import listing from "./listing.scss";
import link from "./../../../../images/careers/link.svg";
import email from "./../../../../images/careers/email.svg";
import linkedin from "./../../../../images/careers/LinkedINicon.svg";
import fb from "./../../../../images/careers/FBicon.svg";
import { showGrowlMessage } from "utils/validate";
import { useStore } from "react-redux";
import { useHistory } from "react-router";
import { copyToClipboard } from "utils/clipboard";
import cs from "classnames";
import Button from "components/Button";

type Props = {
  job: Data;
};

const JobCard: React.FC<Props> = ({ job }) => {
  const { title, loc, summary, id } = job;
  const { dispatch } = useStore();
  const history = useHistory();

  return (
    <div className={listing.job_card_wrp}>
      <div className={listing.job_card_left_wrp}>
        <p className={listing.job_card_heading}>{title}</p>

        <p className={listing.job_card_location}>{loc.join(", ")}</p>
        <p className={listing.job_card_desc}>{summary}</p>
        <Button
          label="read more & apply"
          variant="outlineSmallMedCharcoalCta"
          className={listing.job_card_apply_btn}
          onClick={() => history.push(`/careers/job/${id}`)}
        />
      </div>
      <div className={listing.job_card_right_wrp}>
        <p className={listing.job_card_share_heading}>share</p>
        <ul className={listing.icon_wrp_ul}>
          <li>
            <button
              className={listing.icon_wrp}
              onClick={() => {
                copyToClipboard(`${window.location.origin}/careers/job/${id}`);
                showGrowlMessage(
                  dispatch,
                  "The link of this job has been copied to clipboard!"
                );
              }}
            >
              <img src={link} alt="link" />
            </button>
            <a
              href={`mailto:?subject=I'd like to share a job link with you at Good earth&body=${__DOMAIN__}/careers/job/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={listing.icon_wrp}
            >
              <img src={email} alt="email" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                `${window.location.origin}/careers/job/${id}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={listing.icon_wrp}
            >
              <img src={linkedin} alt="linkedin" />
            </a>
            <a
              target="_blank"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                `${window.location.origin}/careers/job/${id}`
              )}`}
              className={cs("fb-xfbml-parse-ignore", listing.icon_wrp)}
              rel="noopener noreferrer"
            >
              <img src={fb} alt="fb" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default JobCard;
