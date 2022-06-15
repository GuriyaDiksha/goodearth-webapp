import React, { useEffect, useState } from "react";
import listing from "./listing.scss";
import cs from "classnames";
import { clone } from "lodash";
import { Depts, Facets, Locs, Tags } from "containers/careerNew/typings";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

type Props = {
  facets: Facets;
  dept: string;
  setAppliedFilters: any;
  isFilterOpen: boolean;
  setIsFilterOpen: any;
  reset: boolean;
};

const CareerFilter: React.FC<Props> = ({
  facets,
  dept,
  setAppliedFilters,
  isFilterOpen,
  setIsFilterOpen,
  reset
}) => {
  const [depts, setDepts] = useState<Depts[]>([]);
  const [tags, setTags] = useState<Tags[]>([]);
  const [locs, setLocs] = useState<Locs[]>([]);
  const [showMore, setShowMore] = useState({
    depts: false,
    tags: false,
    locs: false,
    appliedFilters: false
  });
  const [hideFilter, setHideFilter] = useState({
    depts: false,
    tags: false,
    locs: false,
    appliedFilters: false
  });
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState<string[]>([dept]);

  const { mobile } = useSelector((state: AppState) => state.device);

  useEffect(() => {
    const { depts, tags, locs }: Facets = facets;

    setDepts(depts.slice(0, 4));
    setTags(tags.slice(0, 4));
    setLocs(locs.slice(0, 4));
  }, [facets]);

  const clearFilter = () => {
    document.getElementById("tag_all").checked = false;
    document.getElementById("loc_all").checked = false;
    setSelectedFilters([]);
    setSelectedDept([dept]);
  };

  useEffect(() => {
    clearFilter();
  }, [reset]);

  const selectFilter = (key: string, isShowMore: boolean) => {
    const { depts, tags, locs } = facets;

    switch (key) {
      case "depts":
        setDepts(isShowMore ? depts : depts.slice(0, 4));
        break;
      case "locs":
        setLocs(isShowMore ? locs : locs.slice(0, 4));
        break;
      case "tags":
        setTags(isShowMore ? tags : tags.slice(0, 4));
        break;
      default:
        return;
    }
  };

  const toggle = (key: string) => {
    selectFilter(key, !showMore[key]);
    setShowMore({ ...showMore, [key]: !showMore[key] });
  };

  const handleCheckbox = (e: any, key: string) => {
    let newList = clone(selectedFilters);
    let newDeptList = clone(selectedDept.filter(e => e !== dept));
    const tagsList = clone(tags.map(e => e.name));
    const locList = clone(locs.map(e => e.name));
    const deptsList = clone(depts.map(e => e.title));

    if (e.target.checked) {
      if (e.target.name === "View All") {
        const newArr = facets[key].map((e: any) => e?.name || e?.title);
        if (key === "depts") {
          newDeptList = [...newDeptList, ...newArr].filter(e => e !== dept);
          setSelectedDept(newDeptList);
        } else {
          newList = [...newList, ...newArr];
          setSelectedFilters(newList);
        }
      } else {
        if (key === "depts") {
          newDeptList = [...newDeptList, e.target.name];
          setSelectedDept(newDeptList);
        } else {
          newList = [...newList, e.target.name];
          setSelectedFilters(newList);
        }
      }
    } else {
      if (e.target.name === "View All") {
        const newArr = facets[key].map((e: any) => e?.name || e.title);
        if (key === "depts") {
          newDeptList = newDeptList.filter(el => !newArr.includes(el));
          setSelectedDept(newDeptList);
        } else {
          newList = newList.filter(el => !newArr.includes(el));
          setSelectedFilters(newList);
        }
      } else {
        if (key === "depts") {
          newDeptList = newDeptList.filter(ele => ele !== e.target?.name);
          setSelectedDept(newDeptList);
        } else {
          newList = newList.filter(ele => ele !== e.target?.name);
          setSelectedFilters(newList);
        }
      }
    }

    newDeptList = newDeptList.includes[dept]
      ? [...newDeptList]
      : [...newDeptList, dept];

    if (
      newList.filter(ele => tagsList.includes(ele)).length === tagsList.length
    ) {
      document.getElementById("tag_all").checked = true;
    } else {
      document.getElementById("tag_all").checked = false;
    }

    if (
      newList.filter(ele => locList.includes(ele)).length === locList.length
    ) {
      document.getElementById("loc_all").checked = true;
    } else {
      document.getElementById("loc_all").checked = false;
    }

    if (newDeptList.length === deptsList.length) {
      document.getElementById("dept_all").checked = true;
    } else {
      document.getElementById("dept_all").checked = false;
    }

    setAppliedFilters([...newList, ...newDeptList]);
  };

  const removeFilter = (name: string) => {
    const newList = clone(selectedFilters);
    const tagsList = clone(tags.map(e => e.name));
    const locList = clone(locs.map(e => e.name));

    if (
      newList.filter(ele => ele !== name).filter(ele => tagsList.includes(ele))
        .length
    ) {
      document.getElementById("tag_all").checked = false;
    }

    if (
      newList.filter(ele => ele !== name).filter(ele => locList.includes(ele))
        .length
    ) {
      document.getElementById("loc_all").checked = false;
    }

    setSelectedFilters(newList.filter(ele => ele !== name));
  };

  return (
    <>
      <div
        className={cs(
          listing.career_list_wrp_left,
          isFilterOpen ? listing.show : ""
        )}
      >
        <ul>
          <li
            className={cs(
              listing.filter_li,
              selectedFilters?.length === 0 ||
                selectedFilters.length === tags.length + locs.length
                ? listing.filter_li_hide
                : ""
            )}
          >
            <span
              className={cs(
                mobile ? listing.filter_applied : listing.filter_label
              )}
              onClick={() => {
                mobile
                  ? setIsFilterOpen(!isFilterOpen)
                  : setHideFilter({
                      ...hideFilter,
                      appliedFilters: !hideFilter.appliedFilters
                    });
              }}
            >
              Filters Applied
            </span>
            <hr className={listing.filter_label_underline} />
            <div
              className={cs(
                listing.filters_wrp,
                hideFilter["appliedFilters"] ? listing.filters_wrp_hide : ""
              )}
            >
              <ul>
                <li className={listing.filter_tag_wrp}>
                  {selectedFilters.map((name, i) => (
                    <div className={listing.filter_tag} key={i}>
                      {name}
                      <span
                        className={listing.close_btn}
                        onClick={() => removeFilter(name)}
                      >
                        x
                      </span>
                    </div>
                  ))}
                </li>
                <li>
                  <button
                    className={listing.see_more_btn}
                    onClick={() => clearFilter()}
                  >
                    Clear All
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li className={listing.filter_li}>
            <span
              className={listing.filter_label}
              onClick={() =>
                setHideFilter({ ...hideFilter, depts: !hideFilter["depts"] })
              }
            >
              By Department
            </span>
            <hr className={listing.filter_label_underline} />
            <div
              className={cs(
                listing.filters_wrp,
                hideFilter["depts"] ? listing.filters_wrp_hide : ""
              )}
            >
              <ul>
                <li>
                  <input
                    id="dept_all"
                    type="checkbox"
                    name="View All"
                    onClick={e => handleCheckbox(e, "depts")}
                  />
                  <label
                    htmlFor={"dept_all"}
                  >{`View All(${facets?.depts?.length})`}</label>
                </li>
                {depts?.map((ele, i) => (
                  <li>
                    <input
                      id={"dept_" + i}
                      type="checkbox"
                      name={ele?.title}
                      checked={
                        dept === ele?.title || selectedDept.includes(ele?.title)
                      }
                      onClick={e => handleCheckbox(e, "depts")}
                    />
                    <label
                      htmlFor={"dept_" + i}
                    >{`${ele?.title}(${ele?.count})`}</label>
                  </li>
                ))}
                <li>
                  <button
                    className={listing.see_more_btn}
                    onClick={() => toggle("depts")}
                  >
                    {showMore.depts ? "- Show Less" : "+ Show More"}
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li className={listing.filter_li}>
            <span
              className={listing.filter_label}
              onClick={() =>
                setHideFilter({ ...hideFilter, tags: !hideFilter["tags"] })
              }
            >
              By Tags
            </span>
            <hr className={listing.filter_label_underline} />
            <div
              className={cs(
                listing.filters_wrp,
                hideFilter["tags"] ? listing.filters_wrp_hide : ""
              )}
            >
              <ul>
                <li>
                  <input
                    id="tag_all"
                    type="checkbox"
                    name="View All"
                    onClick={e => handleCheckbox(e, "tags")}
                  />
                  <label
                    htmlFor={"tag_all"}
                  >{`View All(${facets?.tags?.length})`}</label>
                </li>
                {tags?.map((ele, i) => (
                  <li>
                    <input
                      id={"tags_" + i}
                      type="checkbox"
                      name={ele?.name}
                      checked={selectedFilters.includes(ele?.name)}
                      onClick={e => handleCheckbox(e, "tags")}
                    />
                    <label
                      htmlFor={"tags_" + i}
                    >{`${ele?.name}(${ele?.count})`}</label>
                  </li>
                ))}
                <li>
                  <button
                    className={listing.see_more_btn}
                    onClick={() => toggle("tags")}
                  >
                    {showMore.tags ? "- Show Less" : "+ Show More"}
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li className={listing.filter_li}>
            <span
              className={listing.filter_label}
              onClick={() =>
                setHideFilter({ ...hideFilter, locs: !hideFilter["locs"] })
              }
            >
              By Location
            </span>
            <hr className={listing.filter_label_underline} />
            <div
              className={cs(
                listing.filters_wrp,
                hideFilter["locs"] ? listing.filters_wrp_hide : ""
              )}
            >
              <ul>
                <li>
                  <input
                    id="loc_all"
                    type="checkbox"
                    name="View All"
                    onClick={e => handleCheckbox(e, "locs")}
                  />
                  <label
                    htmlFor={"loc_all"}
                  >{`View All(${facets?.locs?.length})`}</label>
                </li>
                {locs?.map((ele, i) => (
                  <li>
                    <input
                      id={"locs_" + i}
                      type="checkbox"
                      name={ele?.name}
                      checked={selectedFilters.includes(ele?.name)}
                      onClick={e => handleCheckbox(e, "locs")}
                    />
                    <label htmlFor={"locs_" + i}>{`${ele?.name}`}</label>
                  </li>
                ))}
                <li>
                  <button
                    className={listing.see_more_btn}
                    onClick={() => toggle("locs")}
                  >
                    {showMore.locs ? "- Show Less" : "+ Show More"}
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div
        className={cs(
          listing.filter_mobile,
          isFilterOpen ? listing.filter_mobile_hide : ""
        )}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <span>FILTERS APPLIED ({selectedFilters.length})</span>
      </div>
      <div
        className={cs(
          listing.filter_mobile_button,
          isFilterOpen ? "" : listing.filter_mobile_hide
        )}
      >
        <button
          className={listing.cancel_btn}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          Cancel
        </button>
        <button
          className={listing.apply_btn}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          Apply filter
        </button>
      </div>
    </>
  );
};

export default CareerFilter;
