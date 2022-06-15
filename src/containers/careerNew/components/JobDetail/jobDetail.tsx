import React from "react";
import jobDetail from "./jobDetail.scss";
import bannerCareers from "./../../../../images/careers/bannerCareers.png";

const JobDetail: React.FC = () => {
  return (
    <div className={jobDetail.job_detail_wrp}>
      <img src={bannerCareers} alt="banner" width={"100%"} />
      <div className={jobDetail.job_detail_form_wrp}>
        <p>&lt; BACK TO JOB LISTING PAGE</p>
        <div className={jobDetail.job_detail_form}>
          <div className={jobDetail.job_detail_form_left}>left</div>
          <div className={jobDetail.job_detail_form_right}>right</div>
        </div>
        <p>&lt; BACK TO JOB LISTING PAGE</p>
      </div>
    </div>
  );
};

export default JobDetail;
