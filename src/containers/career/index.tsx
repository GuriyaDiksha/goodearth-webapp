import React, { useState, useEffect } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import JobForm from "./components/JobForm";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import secondaryHeaderStyles from "components/SecondaryHeader/styles.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";
import JobList from "./components/JobList";
import { Job } from "./typings";
import careers from "../../images/careers/careers.jpg";
import careersMobile from "../../images/careers/careersMobile.jpg";
import newCareers from "../../images/careers/newCareers.jpg";
import newCareersMobile from "../../images/careers/newCareersMobile.jpg";
import { Link, useHistory } from "react-router-dom";
import CareerService from "services/career";
import { RouteParams } from "routes/typings";

type Props = {} & RouteParams;

const Career: React.FC<Props> = props => {
  const path = props.pathname;
  const history = useHistory();
  const [mode, setMode] = useState<"list" | "applyAll" | "apply">(
    path == "/careers"
      ? "list"
      : path == "/careers/apply/all"
      ? "applyAll"
      : "apply"
  );

  const [locationList, setLocationList] = useState<string[]>([]);
  const [allJobList, setAllJobList] = useState<Job[]>([]);
  const [jobList, setJobList] = useState<Job[]>([]);
  const [applyAllJob, setApplyAllJob] = useState<Job>();
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const [selectedJob, setSelectedJob] = useState<Job>();
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const { mobile } = useSelector((state: AppState) => state.device);
  const dispatch = useDispatch();

  // Fetch Jobs
  useEffect(() => {
    CareerService.fetchJobData(dispatch)
      .then(jobData => {
        const jobList: Job[] = [];
        const locationList: string[] = [];
        jobData.forEach(locationwiseJobs => {
          for (const location in locationwiseJobs) {
            jobList.push(...locationwiseJobs[location]);
            location.toLowerCase() != "any" && locationList.push(location);
          }
        });
        const jobListOnly = jobList.filter(
          job => job.jobTitle.toLowerCase() !== "all"
        );
        const applyAllJob = jobList.filter(
          job => job.jobTitle.toLowerCase() === "all"
        )[0];
        setJobList(jobListOnly);
        setAllJobList(jobListOnly);
        setApplyAllJob(applyAllJob);
        setLocationList(locationList);
      })
      .catch(err => {
        // do nothing
      });
    window.scrollTo(0, 0);
  }, []);

  const openJobForm = (job?: Job) => {
    if (job) {
      const location = encodeURI(job.locationName);
      if (encodeURI(path) != `/careers/${location}/${job.url}`) {
        history.push(`/careers/${location}/${job.url}`);
      }
    } else {
      if (path != "/careers/apply/all") {
        history.push("/careers/apply/all");
      }
    }
    setSelectedJob(job);
  };

  // parse url for job specific page
  useEffect(() => {
    // if (allJobList && allJobList.length > 0) {
    const [city, jobUrl] = decodeURI(path.substring(8))
      .split("/")
      .filter(a => a);
    if (city) {
      if (city != locationFilter && locationList.includes(city)) {
        setLocationFilter(city);
      }
    }
    if (jobUrl) {
      const job = allJobList && allJobList.find(job => jobUrl == job.url);
      if (job) {
        // if (selectedJob != job) {
        openJobForm(job);
        setMode("apply");
        // }
      } else if (jobUrl == "all") {
        openJobForm();
        setMode("applyAll");
      }
    }
    // if (locationList.includes(city))
    else {
      setMode("list");
    }
    // }
  }, [allJobList, locationList, locationFilter, props.slug2]);

  const onChangeFilter = (location?: string) => {
    if (location) {
      setLocationFilter(location);
      setShowMobileDropdown(false);
    }
  };

  // Update JobList on locationFilter change
  useEffect(() => {
    if (allJobList && allJobList.length > 0) {
      if (locationFilter.toLowerCase() == "all") {
        setJobList(allJobList);
      } else {
        const jobFilterList = allJobList.filter(
          job => job.locationName == locationFilter
        );
        setJobList(jobFilterList);
      }
    }
  }, [locationFilter]);

  const showAvailableCareerCities = () => {
    setShowMobileDropdown(!showMobileDropdown);
  };

  return (
    <div className={secondaryHeaderStyles.careers}>
      {mode == "list" ? (
        <>
          {mobile ? (
            <>
              <div className={cs(styles.careerSection, styles.dropdownHeader)}>
                {!showMobileDropdown ? (
                  <div
                    className={cs(
                      styles.careersMobileHeader,
                      styles.customDropdown
                    )}
                  >
                    <h5 className={globalStyles.verticalMiddle}>
                      <span className={globalStyles.cerise}>LOCATION</span>
                    </h5>
                    <div
                      className={cs(
                        styles.careerMobileDropDown,
                        globalStyles.verticalMiddle
                      )}
                      onClick={mobile ? showAvailableCareerCities : () => null}
                    >
                      <div className={styles.careerKeyAll}>
                        <span className={styles.spanLocation}>
                          {locationFilter}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      className={cs(
                        styles.careersMobileHeader,
                        styles.careerSortCross
                      )}
                    >
                      <span
                        className={cs(
                          styles.sortLabel,
                          globalStyles.verticalMiddle
                        )}
                      >
                        Location
                      </span>
                      <span
                        className={cs(
                          styles.cross,
                          globalStyles.verticalMiddle
                        )}
                        onClick={showAvailableCareerCities}
                      >
                        &#x2715;
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                {showMobileDropdown && (
                  <div
                    className={cs(
                      bootstrapStyles.row,
                      globalStyles.minimumWidth
                    )}
                  >
                    <div
                      className={cs(
                        bootstrapStyles.col12,
                        bootstrapStyles.colSm12,
                        styles.mobileFilterMenu
                      )}
                    >
                      <ul className={styles.sort}>
                        <li
                          value={"all"}
                          className={
                            locationFilter == "All" ? globalStyles.cerise : ""
                          }
                          onClick={() => onChangeFilter("All")}
                        >
                          All
                        </li>
                        {locationList.map(location => {
                          return (
                            <li
                              key={location}
                              value={location}
                              onClick={() => onChangeFilter(location)}
                              className={
                                locationFilter == location
                                  ? globalStyles.cerise
                                  : ""
                              }
                            >
                              {location}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </div>{" "}
            </>
          ) : (
            <SecondaryHeader>
              <div
                className={cs(
                  bootstrapStyles.colMd7,
                  bootstrapStyles.offsetMd1,
                  styles.careersHeader,
                  globalStyles.verticalMiddle
                )}
              >
                <div>
                  <Link to="/careers">
                    <span>CAREERS</span>
                  </Link>
                </div>
              </div>
              <div
                className={cs(
                  bootstrapStyles.colMd3,
                  bootstrapStyles.offsetMd1,
                  globalStyles.verticalMiddle,
                  styles.careerFilter
                )}
              >
                <p className={styles.filterText}>LOCATION</p>
                <SelectableDropdownMenu
                  align="right"
                  className={styles.dropdownRoot}
                  items={[
                    { value: "All", label: "All" },
                    ...locationList.map(loc => {
                      return { value: loc, label: loc };
                    })
                  ]}
                  value={locationFilter || "All"}
                  onChange={onChangeFilter}
                  showCaret={true}
                ></SelectableDropdownMenu>
              </div>
            </SecondaryHeader>
          )}

          {/* Careers top banner */}
          <div className={styles.careersContent}>
            <div className={styles.careersImage}>
              <img
                src={mobile ? careersMobile : careers}
                className={globalStyles.imgResponsive}
              />
              <div className={styles.careersImageCaption}>
                <h4>Careers</h4>
                <p className={styles.imageCaption}>
                  {" "}
                  We’re always looking for intelligent, imaginative and
                  selfmotivated people to join our team. Go through the
                  positions available at our studio or send us your resumes and
                  portfolios and we’ll stay connected.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.jobsSection}>
            {jobList && jobList.length > 0 ? (
              <JobList jobList={jobList} openJobForm={openJobForm} />
            ) : (
              <p className={styles.noJobMessages}>
                There are currently no openings available at the moment, please
                check back soon.
              </p>
            )}
          </div>
          <div className={cs(styles.careersContent, styles.newcareersContent)}>
            <div className={styles.careersImage}>
              <img
                src={mobile ? newCareersMobile : newCareers}
                className={globalStyles.imgResponsive}
              />
            </div>
            <div className={styles.careersImageCaption}>
              <h3>{`Can't find a role you are looking for?`}</h3>
              <div className={styles.newcareersInput}>
                <input
                  type="button"
                  className={cs(globalStyles.ceriseBtn, styles.ceriseBtn)}
                  value="Get in touch"
                  onClick={() => openJobForm()}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <SecondaryHeader>
            <div
              className={cs(
                bootstrapStyles.colMd7,
                bootstrapStyles.offsetMd1,
                styles.careersHeader,
                globalStyles.verticalMiddle
              )}
            >
              <div className={styles.careerBackButton}>
                <p className={globalStyles.op2}>
                  <Link to="/careers">
                    <span className={styles.unicode}>&lsaquo;</span>
                    <span className={styles.backToLink}>BACK TO CAREERS</span>
                  </Link>
                </p>
              </div>
            </div>
          </SecondaryHeader>
          <JobForm
            mode={mode}
            job={selectedJob}
            mobile={mobile}
            applyAllJob={applyAllJob}
          />
        </>
      )}
    </div>
  );
};

export default Career;
