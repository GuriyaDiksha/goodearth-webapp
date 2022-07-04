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
import { useParams } from "react-router";
import { Data } from "containers/careerNew/typings";
import Loader from "components/Loader";
import { Link } from "react-router-dom";
import { copyToClipboard } from "utils/clipboard";

const JobDetail: React.FC = () => {
  const { data }: CareerData = useSelector((state: AppState) => state.career);
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useStore();
  const [jobData, setJobData] = useState<Data>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setJobData(data.find(ele => ele?.id == +id));
    setIsLoading(false);
  }, [data]);

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
        <Link
          className={jobDetail.job_detail_form_back}
          to={`/careers/list/${jobData?.dept}`}
        >
          &lt; BACK TO JOB LISTING PAGE
        </Link>

        <div className={jobDetail.job_detail_form}>
          <div className={jobDetail.job_detail_form_left}>
            <p className={jobDetail.job_detail_form_heading}>
              {jobData?.title}
            </p>

            {jobData?.loc ? (
              <>
                <p className={jobDetail.job_detail_form_sub_head}>LOCATION</p>
                <p className={jobDetail.job_detail_form_desc}>{jobData?.loc}</p>
              </>
            ) : null}

            {jobData?.exp ? (
              <>
                <p className={jobDetail.job_detail_form_sub_head}>
                  YEARS OF EXPERIENCE
                </p>
                <p className={jobDetail.job_detail_form_desc}>
                  {jobData?.exp} years
                </p>
              </>
            ) : null}

            {jobData?.desc ? (
              <>
                <p className={jobDetail.job_detail_form_sub_head}>
                  JOB DESCRIPTION
                </p>
                <div
                  className={jobDetail.job_detail_form_desc}
                  dangerouslySetInnerHTML={{ __html: jobData?.desc || "" }}
                ></div>
              </>
            ) : null}

            {jobData?.req ? (
              <>
                <p className={jobDetail.job_detail_form_sub_head}>
                  REQUIREMENTS
                </p>
                <div
                  className={jobDetail.job_detail_form_desc}
                  dangerouslySetInnerHTML={{ __html: jobData?.req || "" }}
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
                <a
                  href="#"
                  rel="noopener noreferrer"
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
                </a>
              </li>

              <li>
                <a href={`mailto:`} target="_blank" rel="noopener noreferrer">
                  <img src={email} alt="email" />
                </a>
              </li>

              <li>
                <a
                  href="https://in.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={linkedin} alt="linkedin" />
                </a>
              </li>

              <li>
                <a
                  href="https://www.facebook.com/GoodEarthIndia/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={fb} alt="fb" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Link
          className={jobDetail.job_detail_form_back}
          to={`/careers/list/${jobData?.dept}`}
        >
          &lt; BACK TO JOB LISTING PAGE
        </Link>
      </div>
    </div>
  );
};

export default JobDetail;
