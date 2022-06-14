import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CareerFilter from "./careerFilter";
import listing from "./listing.scss";
import JobCard from "./jobCard";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import { CareerData } from "reducers/career/typings";
import { Data } from "containers/careerNew/typings";

const Listing: React.FC = () => {
  const { dept } = useParams<{ dept: string }>();
  const { facets, data }: CareerData = useSelector(
    (state: AppState) => state.career
  );
  const [appliedFilters, setAppliedFilters] = useState([dept]);
  const [filteredData, setFilteredData] = useState<Data[]>([]);

  useEffect(() => {
    setFilteredData(data.filter(ele => ele?.dept === dept));
  }, [data]);

  useEffect(() => {
    const newData = data.filter(ele => appliedFilters.includes(ele?.dept));

    setFilteredData(newData);
  }, [appliedFilters]);

  const multipleExist = (arr: string[], values: string[]) => {
    return values.every(value => {
      return arr.includes(value);
    });
  };

  console.log(filteredData, appliedFilters);

  return (
    <div className={listing.career_list_main_wrp}>
      <div className={listing.career_list_wrp}>
        <CareerFilter
          facets={facets}
          dept={dept}
          setAppliedFilters={setAppliedFilters}
        />

        <div className={cs(listing.career_list_wrp_right)}>
          <p className={listing.opportunities_count}>
            {filteredData?.length} Opportunities Available
          </p>
          {filteredData?.map(job => (
            <JobCard job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Listing;
