import React from "react";
import { Job } from "containers/career/typings";
import styles from "../../styles.scss";
import globalStyles from "../../../../styles/global.scss";
import cs from "classnames";

type Props = {
  jobList: Job[];
  openJobForm: (job: Job) => void;
};

const JobList: React.FC<Props> = props => {
  return (
    <div className={styles.jobList}>
      {props.jobList.map((job, i) => {
        return (
          <div key={job.jobId} className={styles.jobListSection}>
            <div className={styles.jobDetails}>
              <h5>{job.jobTitle}</h5>
              <h6 className={cs(styles.jobLocation, globalStyles.op2)}>
                {job.locationName}
              </h6>
              <p className={cs(styles.jobId, globalStyles.op2)}>
                <span className={styles.jobId}>JOB ID:</span> &nbsp;{job.jobId}
              </p>
              <p className={cs(styles.jobDescription, globalStyles.op2)}>
                {job.jobShortDescription.split("").join("").length > 100
                  ? job.jobShortDescription
                      .split("")
                      .join("")
                      .substring(0, 100)
                      .concat("...")
                  : job.jobShortDescription}
              </p>
            </div>
            <input
              type="button"
              className={globalStyles.ceriseBtn}
              value="Apply"
              onClick={() => {
                props.openJobForm(job);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
export default JobList;
