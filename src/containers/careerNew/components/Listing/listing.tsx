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
import Loader from "components/Loader";

const Listing: React.FC = () => {
  const { dept } = useParams<{ dept: string }>();
  const { facets, data }: CareerData = useSelector(
    (state: AppState) => state.career
  );
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<Data[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setSelectedDept([dept]);
  }, []);

  useEffect(() => {
    setFilteredData(data.filter(ele => ele?.dept === dept));
    setIsLoading(false);
  }, [data]);

  const multipleExist = (arr: string[], values: string[]) => {
    return values.some(value => {
      return arr.includes(value);
    });
  };

  useEffect(() => {
    let newData = data.filter(ele => selectedDept.includes(ele?.dept));
    const tagFilteres = facets.tags
      .map(ele => ele.name)
      .filter(ele => appliedFilters.includes(ele));
    const locsFilteres = facets.locs
      .map(ele => ele.name)
      .filter(ele => appliedFilters.includes(ele));

    if (locsFilteres.length) {
      newData = newData.filter(ele => locsFilteres.includes(ele?.loc));
    }

    if (tagFilteres.length) {
      newData = newData.filter(ele => multipleExist(tagFilteres, ele.tags));
    }

    setFilteredData(newData);
  }, [appliedFilters, selectedDept]);

  const NoResultsFound = () => (
    <div className={listing.no_resords_wrp}>
      <p className={listing.no_resords_heading}>Oops! No results found.</p>
      <p className={listing.no_resords_desc}>
        No opportunities found for your search criteria. Reset your filters to
        view more results.
      </p>
      <button
        className={listing.no_resords_btn}
        onClick={() => setReset(!reset)}
      >
        Reset filters
      </button>
    </div>
  );

  return (
    <div className={listing.career_list_main_wrp}>
      <div className={listing.career_list_wrp}>
        <CareerFilter
          facets={facets}
          dept={dept}
          setAppliedFilters={setAppliedFilters}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          reset={reset}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
        />

        <div
          className={cs(
            listing.career_list_wrp_right,
            isFilterOpen ? listing.hide : ""
          )}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <p className={listing.opportunities_count}>
                {filteredData?.length} Opportunities Available
              </p>
              {filteredData?.length ? (
                filteredData?.map(job => <JobCard job={job} />)
              ) : (
                <NoResultsFound />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listing;
