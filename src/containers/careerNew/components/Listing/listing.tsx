import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CareerFilter from "./careerFilter";
import listing from "./listing.scss";
import JobCard from "./jobCard";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { useDispatch, useSelector } from "react-redux";
import { CareerData } from "reducers/career/typings";
import { Data } from "containers/careerNew/typings";
import Loader from "components/Loader";
import CareerService from "services/career";
import { updateJobList } from "actions/career";
import { uniq } from "lodash";
import bootstrap from "../../../../styles/bootstrap/bootstrap-grid.scss";

const Listing: React.FC = () => {
  const { facets, data }: CareerData = useSelector(
    (state: AppState) => state.career
  );
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<Data[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tagLocFilter, setTagLocFilter] = useState<{
    tag: string[];
    loc: string[];
  }>({ tag: [], loc: [] });
  const { mobile } = useSelector((state: AppState) => state.device);
  const history = useHistory();
  const dispatch = useDispatch();
  const vars: { dept?: string; loc?: string; tag?: string } = {};
  const url = history.location.search;
  let temp: any = [];
  const re = /[?&]+([^=&]+)=([^&]*)/gi;
  let match;

  while ((match = re.exec(url))) {
    vars[match[1]] = match[2];
  }

  useEffect(() => {
    CareerService.fetchJobListData(dispatch, vars.dept)
      .then(res => {
        setReset(!reset);
        dispatch(updateJobList(res));
      })
      .catch(e => {
        setReset(!reset);
        dispatch(
          updateJobList({ facets: { depts: [], locs: [], tags: [] }, data: [] })
        );
      });

    if (vars?.dept) {
      setSelectedDept(vars.dept.split("|").map(e => e.replace(/%20/g, " ")));
    }

    if (vars?.loc) {
      temp = [
        ...temp,
        ...vars?.loc?.split("|").map(e => e.replace(/%20/g, " "))
      ];
    }
    if (vars?.tag) {
      temp = [
        ...temp,
        ...vars?.tag?.split("|").map(e => e.replace(/%20/g, " "))
      ];
    }

    setAppliedFilters(temp);
  }, [vars?.dept]);

  const multipleExist = (arr: string[], values: string[]) => {
    return values.some(value => {
      return arr.includes(value);
    });
  };

  useEffect(() => {
    let newTag: string[] = [],
      newLoc: string[] = [];
    const url = history?.location.pathname;
    let deptUrl = "dept=";

    setIsLoading(true);

    if (selectedDept.length && facets?.depts?.length) {
      let newData = data.filter(ele => selectedDept.includes(ele?.dept));

      if (newData?.length) {
        newData.map(ele => {
          newTag = [...newTag, ...ele?.tags];
          newLoc = [...newLoc, ...ele?.loc];
          setTagLocFilter({ tag: uniq(newTag), loc: uniq(newLoc) });
        });
      } else {
        setTagLocFilter({ tag: [], loc: [] });
      }

      deptUrl = deptUrl + selectedDept.join("|");
      deptUrl = appliedFilters.filter(e => newTag.includes(e)).length
        ? deptUrl +
          "&tag=" +
          appliedFilters.filter(e => newTag.includes(e)).join("|")
        : deptUrl;
      deptUrl = appliedFilters.filter(e => newLoc.includes(e))?.length
        ? deptUrl +
          "&loc=" +
          appliedFilters.filter(e => newLoc.includes(e)).join("|")
        : deptUrl;

      const tagFilteres = facets.tags
        .map(ele => ele.name)
        .filter(ele =>
          appliedFilters
            .filter(e => newTag.includes(e) || newLoc.includes(e))
            .includes(ele)
        );
      const locsFilteres = facets.locs
        .map(ele => ele.name)
        .filter(ele =>
          appliedFilters
            .filter(e => newTag.includes(e) || newLoc.includes(e))
            .includes(ele)
        );

      if (locsFilteres.length) {
        newData = newData.filter(ele => multipleExist(locsFilteres, ele?.loc));
      }

      if (tagFilteres.length) {
        newData = newData.filter(ele => multipleExist(tagFilteres, ele?.tags));
      }
      setFilteredData(newData);
      newData.map(ele => {
        newTag = [...newTag, ...ele?.tags];
        newLoc = [...newLoc, ...ele?.loc];
        setTagLocFilter({ tag: uniq(newTag), loc: uniq(newLoc) });
      });
      history.replace(url + "?" + deptUrl);
    }
    setIsLoading(false);
  }, [appliedFilters, selectedDept, facets]);

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
      <div className={cs(listing.career_list_wrp, bootstrap.row)}>
        <CareerFilter
          appliedFilters={appliedFilters}
          facets={facets}
          setAppliedFilters={setAppliedFilters}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          reset={reset}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          tagLocFilter={tagLocFilter}
        />

        <div
          className={cs(
            mobile ? bootstrap.col12 : bootstrap.col8,
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
                filteredData?.map((job, ind) => <JobCard job={job} key={ind} />)
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
