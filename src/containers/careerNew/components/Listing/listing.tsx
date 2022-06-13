import React from "react";
import { useParams } from "react-router-dom";
import CareerFilter from "./careerFilter";
import listing from "./listing.scss";
import JobCard from "./jobCard";
import cs from "classnames";

const Listing: React.FC = () => {
  const { dept } = useParams<{ dept: string }>();

  console.log("dept=====", dept);

  return (
    <div className={listing.career_list_main_wrp}>
      <div className={listing.career_list_wrp}>
        <div className={cs(listing.career_list_wrp_left)}>
          <CareerFilter />
        </div>
        <div className={cs(listing.career_list_wrp_right)}>
          <p className={listing.opportunities_count}>
            20 Opportunities Available
          </p>
          <JobCard />
          <JobCard />
          <JobCard />
          <JobCard />
          <JobCard />
          <JobCard />
          <JobCard />
          <JobCard />
        </div>
      </div>
      <div className={listing.filter_mobile}>
        <span>FILTERS APPLIED</span>
      </div>
    </div>
  );
};

export default Listing;
