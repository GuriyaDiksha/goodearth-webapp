import React, { useState, useEffect } from "react";
import SecondaryHeader from "components/SecondaryHeader";
// import JobList from './components/JobList';
import JobForm from "./components/JobForm";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import MobileDropdownMenu from "components/MobileDropdown";
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
import { RouteComponentProps, Link } from "react-router-dom";
import CareerService from "services/career";

type Props = {} & RouteComponentProps;

// const demoJob: Job = {
//   locationName: "New Delhi",
//   url: "Digital_Marketing_Analyst-GE000005",
//   jobId: 5,
//   jobShortDescription: "Hiring for Digital Marketing Analytics with experience of 2-5 years.\r\nShare your CVs at careers@goodearth.in\r\n\r\n\r\n",
//   jobLongDescription: "<p>Job description</p><ul><li>Analyzing website&apos;s key performance metrics and behavior flow using Google analytics</li><li>Making sure all existing features and new features are getting tracked on the website and deriving insights on usability and impact on key metrics</li><li>Making recommendations regarding website behavior flow improvements</li><li>Stitch marketing campaigns metrics and traffic quality to analyse for further scope of improvement in marketing channels</li><li>Work with customer analytics team to tie in marketing and website data to derive inferences on any campaign performance</li></ul><p>The JD can be extended to following -</p><ul><li>Execute FB and Google ad campaigns</li><li>Take up marketing operations involved in SEO &ndash; e.g., relevant keywords research and populating meta keywords info</li><li>Regularly analyzing for SEO friendliness and raise any red flags with tech team. Keep a tab on Organic Google ranking improvements</li></ul>",
//   jobTitle: "Digital Marketing Analyst",
//   jobsId: "GE000005",
// }

const Career: React.FC<Props> = props => {
  const path = props.history.location.pathname;
  const [mode, setMode] = useState<"list" | "applyAll" | "apply">(
    path == "/careers"
      ? "list"
      : path == "/careers/apply/all"
      ? "applyAll"
      : "apply"
  );
  // const [ jobData,
  // setJobsData
  //  ] = useState([{"All": []}]);
  const [locationList, setLocationList] = useState<string[]>([]);
  const [allJobList, setAllJobList] = useState<Job[]>([]);
  const [jobList, setJobList] = useState<Job[]>();
  const [applyAllJob, setApplyAllJob] = useState<Job>();
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<Job>();
  const { mobile } = useSelector((state: AppState) => state.device);
  const dispatch = useDispatch();

  // options: [],
  // jobListAll: [],
  // jobListingsOnly: [],
  // jobListByLocation: [],
  // selectedLocation: "All",
  // hasDataAvailable: false,
  // shouldShowForm: false,
  // jobDetails: {},
  // mobileFilter: false,

  // componentDidMount() {
  //     this.getLocations();
  //     this.getJobList();
  // }
  //
  useEffect(() => {
    // fetchCountryData();
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
  // useEffect(() => {
  //   setSelectedJob(demoJob);
  // },[]);

  const openJobForm = (job?: Job) => {
    if (job) {
      // setMode("apply");
      const location = encodeURI(job.locationName);
      if (encodeURI(path) != `/careers/${location}/${job.url}`) {
        props.history.push(`/careers/${location}/${job.url}`);
      }
    } else {
      // setMode("applyAll");
      if (path != "/careers/apply/all") {
        props.history.push("/careers/apply/all");
      }
    }
    setSelectedJob(job);
  };

  // parse url for job specific page
  useEffect(() => {
    if (allJobList && allJobList.length > 0) {
      // console.log(props.history);
      const [city, jobUrl] = decodeURI(path.substring(8))
        .split("/")
        .filter(a => a);
      if (city) {
        if (city != locationFilter && locationList.includes(city)) {
          setLocationFilter(city);
        }
      }
      if (jobUrl) {
        // const decodeJob = job.split("-");
        // const jobsId = decodeJob[decodeJob.length -1];
        // if(jobsId) {
        // const selectedJob = jobList.find(job => job.jobsId == jobsId);

        const job = allJobList && allJobList.find(job => jobUrl == job.url);
        if (job) {
          if (selectedJob != job) {
            openJobForm(job);
            setMode("apply");
          }
        } else {
          openJobForm();
          setMode("applyAll");
        }
        // else if(jobUrl == "all") {
        //   setSelectedJob(undefined);
        //   setMode("applyAll");
        // }
      } else if (locationList.includes(city)) {
        setMode("list");
      }
    }
  }, [allJobList, locationList, locationFilter]);

  const onChangeFilter = (location?: string) => {
    if (location) {
      setLocationFilter(location);

      if (allJobList && allJobList.length > 0) {
        const jobFilterList = allJobList.filter(
          job => job.locationName == location
        );
        setJobList(jobFilterList);
      }
    }
  };

  useEffect(() => {
    if (allJobList && allJobList.length > 0) {
      const jobFilterList = allJobList.filter(
        job => job.locationName == locationFilter
      );
      setJobList(jobFilterList);
    }
  }, [locationFilter]);
  // setSelectedCity(location) {
  //     this.setState({
  //         selectedLocation: location,
  //         showMobileDropdown: false
  //     }, this.filterJobList);
  // }

  // getLocations() {
  //     axios(`${Config.hostname}myapi/career_locationmaster_api`)
  //         .then((locations) => {
  //             this.setState({
  //                 options: locations.data.filter((city) => {
  //                     return city !== "Any";
  //                 })
  //             });
  //         });
  // }

  // const getJobList = () => {
  //     let city = window.location.pathname.replace("/careers/", "").split('/')[0];
  //     let job = window.location.pathname.replace("/careers/", "").split('/')[1];
  //     axios(`${Config.hostname}myapi/career_landingpage_api`)
  //         .then((jobList) => {
  //             let jobListings = [];
  //             jobList.data.forEach(jobsByLocation => {
  //                 Object.entries(jobsByLocation).forEach(([location, jobs]) => {
  //                     Object.entries(jobs).forEach(([index, job]) => {
  //                         jobListings.push(job);
  //                     });
  //                 });
  //             });
  //             let jobListingsOnly = jobListings.filter((job) => {
  //                 return job.job_title !== 'all';
  //             })
  //             this.setState({
  //                 jobListAll: jobListings,
  //                 jobListingsOnly: jobListingsOnly,
  //                 jobListByLocation: jobListingsOnly,
  //                 hasDataAvailable: true,
  //                 selectedLocation: city ? city : "All",
  //             }, this.filterJobList)
  //             if (job) {
  //                 jobListings.forEach((data, i) => {
  //                     if (job == data.url || job === "all") {
  //                         this.goToJobApplicationForm(data.jobid, data.job_title)
  //                     }
  //                 })
  //             }
  //         });
  // };

  // onSelect(event) {
  //     this.setState({
  //         selectedLocation: event.value
  //     }, this.filterJobList);
  //     // history.pushState({}, null, location.pathname + event.value);
  //     let url_index = window.location.pathname.replace("/careers/", "").split('/')[0];
  //     if (!url_index) {
  //         history.pushState({}, null, location.pathname + event.value);
  //     } else {
  //         let len = location.pathname.split('/').length;
  //         let string = location.pathname.split('/');
  //         string[len - 1] = event.value;
  //         history.pushState({}, null, string.join('/'));
  //     }

  // }

  // filterJobList() {
  //     let jobListByLocation = this.state.jobListingsOnly.filter(job => job.location_name === this.state.selectedLocation);
  //     if (this.state.selectedLocation == 'All') {
  //         jobListByLocation = this.state.jobListingsOnly;
  //     }
  //     this.setState({
  //         jobListByLocation: jobListByLocation
  //     })
  // }

  // goToJobApplicationForm(jobId, jobTitle) {
  //     let formdata = new FormData();
  //     let self = this;
  //     formdata.append('job_id', jobId);
  //     if(jobTitle === "all") {
  //         let jobDescription = {
  //             job_id: jobId,
  //             job_title: jobTitle
  //         }
  //         let shouldShowJobForm = true;
  //         self.showJobApplicationForm({jobDescription, shouldShowJobForm});
  //     }
  //     else {
  //         axios.post(`${Config.hostname}myapi/job_application_api/`, formdata)
  //         .then(response => {
  //             const jobDescription = response.data[0];
  //             jobDescription.job_id = jobId;
  //             let shouldShowJobForm = true;
  //             self.showJobApplicationForm({jobDescription, shouldShowJobForm});
  //         })
  //     }

  // }

  // showJobApplicationForm({jobDescription, shouldShowJobForm}, url) {
  //     if (url) {
  //         let url_index = window.location.pathname.replace("/careers/", "").split('/')[1];
  //         if (!url_index) {
  //             history.pushState({}, null, location.pathname + '/' + url);
  //         } else {
  //             let len = location.pathname.split('/').length;
  //             let string = location.pathname.split('/');
  //             string[len - 1] = url;
  //             history.pushState({}, null, string.join('/'));
  //         }
  //     }

  //     this.setState({
  //         jobDetails: jobDescription,
  //         shouldShowForm: shouldShowJobForm
  //     })
  // }

  // showAvailableCareerCities() {
  //     this.setState({
  //         showMobileDropdown: !this.state.showMobileDropdown
  //     })
  // }

  // getJobApplicationForm(jobId, city, url) {
  //     let formdata = new FormData();
  //     if(url === "apply/all") {
  //         let job = this.state.jobListAll.filter((job) => {
  //             return job.job_title === 'all'
  //         });
  //         let job_id = job[0].jobid;
  //         formdata.append('job_id', job_id);
  //         let updatedUrl = window.location.pathname.replace('/careers/', '') === 'apply/all' ? '' : url;
  //         history.pushState({}, null, updatedUrl);
  //         let shouldShowJobForm = true;
  //         let jobDescription = {
  //             job_id: job_id,
  //             job_title: 'all'
  //         };
  //         this.showJobApplicationForm({jobDescription, shouldShowJobForm});
  //     }
  //     else {
  //         // formdata.append('job_id', jobId);
  //         // axios.post(`${Config.hostname}myapi/job_application_api/`, formdata)
  //         // .then(response => {
  //         //     const jobDescription = response.data[0];
  //         //     let url_index = window.location.pathname.replace("/careers/", "").split('/')[0];
  //         //     if (!url_index) {
  //         //         history.pushState({}, null, location.pathname + city);
  //         //     } else {
  //         //         let len = location.pathname.split('/').length;
  //         //         let string = location.pathname.split('/');
  //         //         string[len - 1] = city;
  //         //         history.pushState({}, null, string.join('/'));
  //         //     }
  //         //     jobDescription.job_id = jobId;
  //         //     let shouldShowJobForm = true;
  //         //     this.showJobApplicationForm({jobDescription, shouldShowJobForm}, url);
  //         //
  //         // })
  //         window.location.href = `${Config.hostname}careers/${city}/${url}/`;
  //     }

  // }

  // let url_index = window.location.pathname.replace("/careers/", "").split('/')[1];

  // const mainContent = (
  //     (mode == "list" || !url_index?
  //         <div className="careers-main">
  //             <div className="career-section dropdown-header">
  //                 {!this.state.showMobileDropdown ?
  //                     <div
  //                         className={!this.props.mobile ? "careers-header custom-dropdown" : "careers-mobile-header custom-dropdown"}>
  //                         {!this.props.mobile ? <h5><a href="/careers"><span>CAREERS</span></a></h5> :
  //                             <h5><span className="cerise">LOCATION</span></h5>}
  //                         {!this.props.mobile ?
  //                             <div className="drop-div custom-dropdown">
  //                                 <span className="span-location">Location</span>
  //                                 <Dropdown className='careers-cities' options={this.state.options}
  //                                             onChange={(e) => this.onSelect(e)}
  //                                             value={this.state.selectedLocation}
  //                                             placeholder="Select an option"/>
  //                             </div> :
  //                             <div className="career-mobile-drop-down"
  //                                     onClick={this.props.mobile ? this.showAvailableCareerCities : ""}>
  //                                 <div className="career-key-all">
  //                                     <span className="span-location">{this.state.selectedLocation}</span>
  //                                 </div>
  //                             </div>}
  //                     </div> :
  //                     <div>
  //                         <div className="careers-mobile-header career-sort-cross">
  //                             <span className="sort-label">Location</span>
  //                             <span className="cross" onClick={this.showAvailableCareerCities}>&#x2715;</span>
  //                         </div>
  //                     </div>}
  //             </div>
  //             {this.state.showMobileDropdown && <div className="row minimumWidth">
  //                 <div className="col-xs-12 col-sm-12 mobile-filter-menu ">
  //                     <ul className="sort hidden-md hidden-lg">
  //                         <li value={'all'} className={this.state.selectedLocation == 'All' ? "cerise":""}
  //                             onClick={this.setSelectedCity.bind(this, 'All')}>All
  //                         </li>
  //                         {this.state.options.map(data => {
  //                             return <li value={data} onClick={this.setSelectedCity.bind(this, data)}
  //                                         className={this.state.selectedLocation == data ? "cerise" : ""}>{data}</li>
  //                         })}
  //                     </ul>
  //                 </div>
  //             </div>}

  //         </div>
  //         :

  //       <div></div>
  //     );

  // useEffect(() => {
  //   getJobList();
  // }, []);

  return (
    <div className={secondaryHeaderStyles.careers}>
      {mode == "list" ? (
        // || !url_index
        <>
          <SecondaryHeader>
            {mobile ? (
              <div>
                <MobileDropdownMenu
                  list={locationList}
                  onChange={onChangeFilter}
                  showCaret={true}
                  open={false}
                  value="All"
                />
              </div>
            ) : (
              <>
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
                    globalStyles.verticalMiddle
                  )}
                >
                  <p className={styles.filterText}>LOCATION</p>
                  <SelectableDropdownMenu
                    align="right"
                    className={styles.dropdownRoot}
                    items={locationList.map(loc => {
                      return { value: loc, label: loc };
                    })}
                    value={locationFilter || "All"}
                    onChange={onChangeFilter}
                    showCaret={true}
                  ></SelectableDropdownMenu>
                </div>
              </>
            )}
          </SecondaryHeader>
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
            {/* {this.state.hasDataAvailable && this.state.jobListingsOnly.length > 0 ? */}
            {jobList && jobList.length > 0 ? (
              <JobList
                jobList={jobList}
                // locationFilter={locationFilter}
                openJobForm={openJobForm}
              />
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
                  className={globalStyles.ceriseBtn}
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
                <p className={styles.op2}>
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
