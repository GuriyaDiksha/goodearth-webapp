import React, { useEffect, useState } from "react";
import jobDetail from "./jobDetail.scss";
import bannerCareers from "./../../../../images/careers/bannerCareers.png";
import link from "./../../../../images/careers/link.svg";
import email from "./../../../../images/careers/email.svg";
import linkedin from "./../../../../images/careers/LinkedINicon.svg";
import fb from "./../../../../images/careers/FBicon.svg";
import * as valid from "utils/validate";
import { useSelector, useStore } from "react-redux";
import { CareerData } from "reducers/career/typings";
import { AppState } from "reducers/typings";
import { useHistory, useParams } from "react-router";
import Loader from "components/Loader";
import { copyToClipboard } from "utils/clipboard";
import ReactHtmlParser from "react-html-parser";
import CareerService from "services/career";
import { updateJob } from "actions/career";

const JobDetail: React.FC = () => {
  const { job }: CareerData = useSelector((state: AppState) => state.career);
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const history = useHistory();

  useEffect(() => {
    CareerService.fetchJob(dispatch, Number(id)).then(res => {
      dispatch(updateJob(res));
    });
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [job]);

  const applyNow = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLScO4bArbyl_YeXZqYZtWSrKfFyOp9UVAejgFvbf5UR60k8nOQ/viewform?_ga=2.91865114.1029825071.1647345387-2106724779.1644984711",
      "_blank"
    );
  };

  return (
    <div className={jobDetail.job_detail_wrp}>
      <div className={jobDetail.job_detail_img_wrp}>
        <img src={bannerCareers} alt="banner" width={"100%"} />
      </div>
      {isLoading && <Loader />}

      <div className={jobDetail.job_detail_form_wrp}>
        <button
          className={jobDetail.job_detail_form_back}
          onClick={() => history.goBack()}
        >
          &lt; BACK TO JOB LISTING PAGE
        </button>

        <div className={jobDetail.job_detail_form}>
          <div className={jobDetail.job_detail_form_left}>
            <p className={jobDetail.job_detail_form_heading}>{job?.title}</p>

            {job?.loc ? (
              <>
                <p className={jobDetail.job_detail_form_sub_head}>LOCATION</p>
                <p className={jobDetail.job_detail_form_desc}>
                  {job?.loc?.join(", ")}
                </p>
              </>
            ) : null}

            {job?.exp ? (
              <>
                <p className={jobDetail.job_detail_form_sub_head}>
                  YEARS OF EXPERIENCE
                </p>
                <p className={jobDetail.job_detail_form_desc}>
                  {job?.exp} years
                </p>
              </>
            ) : null}

            {job?.desc ? (
              <>
                <p className={jobDetail.job_detail_form_sub_head}>
                  JOB DESCRIPTION
                </p>
                <div
                  className={jobDetail.job_detail_form_desc}
                  // dangerouslySetInnerHTML={{ __html: job?.desc || "" }}
                >
                  {ReactHtmlParser(job?.desc)}
                </div>
              </>
            ) : null}

            {job?.req ? (
              <>
                <p className={jobDetail.job_detail_form_sub_head}>
                  REQUIREMENTS
                </p>
                <div
                  className={jobDetail.job_detail_form_desc}
                  dangerouslySetInnerHTML={{ __html: job?.req || "" }}
                ></div>
              </>
            ) : null}
          </div>
          <div className={jobDetail.job_detail_form_right}>
            <button
              className={jobDetail.job_detail_apply_btn}
              onClick={() => applyNow()}
            >
              Apply Now
            </button>
            <ul className={jobDetail.job_detail_share_wrp}>
              <li className={jobDetail.job_detail_share_li}>Share</li>
              <li>
                <button
                  onClick={() => {
                    copyToClipboard(
                      `${window?.location?.origin}/careers/job/${id}`
                    );
                    valid.showGrowlMessage(
                      dispatch,
                      "The link of this job has been copied to clipboard!"
                    );
                  }}
                >
                  <img src={link} alt="link" />
                </button>
              </li>

              <li>
                <a href={`mailto:`} target="_blank" rel="noopener noreferrer">
                  <img src={email} alt="email" />
                </a>
              </li>

              <li>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    `${window.location.origin}/careers/job/${id}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={linkedin} alt="linkedin" />
                </a>
              </li>

              <li>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    `${window.location.origin}/careers/job/${id}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={fb} alt="fb" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <button
          className={jobDetail.job_detail_form_back}
          onClick={() => history.goBack()}
        >
          &lt; BACK TO JOB LISTING PAGE
        </button>
      </div>
    </div>
  );
};

export default JobDetail;
