import React, { useEffect, useState } from "react";
import listing from "./listing.scss";
import cs from "classnames";
import { clone } from "lodash";
import { Depts, Facets, Locs, Tags } from "containers/careerNew/typings";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import bootstrap from "../../../../styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "../../../../styles/iconFonts.scss";

type Props = {
  facets: Facets;
  appliedFilters: string[];
  setAppliedFilters: any;
  isFilterOpen: boolean;
  setIsFilterOpen: any;
  reset: boolean;
  selectedDept: string[];
  setSelectedDept: any;
  tagLocFilter: { tag: string[]; loc: string[] };
};

const CareerFilter: React.FC<Props> = ({
  facets,
  appliedFilters,
  setAppliedFilters,
  isFilterOpen,
  setIsFilterOpen,
  reset,
  selectedDept,
  setSelectedDept,
  tagLocFilter
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
  const [oldStateOfFilters, setOldStateOfFilters] = useState<{
    dept: string[];
    filters: string[];
  }>({ dept: [], filters: [] });
  const { mobile } = useSelector((state: AppState) => state.device);

  const handleViewAllForFilters = (newList: any, tags: any, locs: any) => {
    const tagsList = clone(tags.map((e: any) => e.name));
    const locList = clone(locs.map((e: any) => e.name));
    if (
      newList.filter((ele: any) => tagsList.includes(ele)).length !== 0 &&
      newList.filter((ele: any) => tagsList.includes(ele)).length ===
        tagsList.length
    ) {
      (document.getElementById("tag_all") as HTMLInputElement).checked = true;
    } else {
      (document.getElementById("tag_all") as HTMLInputElement).checked = false;
    }

    if (
      newList.filter((ele: any) => locList.includes(ele)).length !== 0 &&
      newList.filter((ele: any) => locList.includes(ele)).length ===
        locList.length
    ) {
      (document.getElementById("loc_all") as HTMLInputElement).checked = true;
    } else {
      (document.getElementById("loc_all") as HTMLInputElement).checked = false;
    }
  };

  const handleViewAll = (
    newList: any,
    newDeptList: any,
    tags: any,
    locs: any
  ) => {
    handleViewAllForFilters(newList, tags, locs);

    if (
      newDeptList.length !== 0 &&
      newDeptList.length === facets?.depts.length
    ) {
      (document.getElementById("dept_all") as HTMLInputElement).checked = true;
    } else {
      (document.getElementById("dept_all") as HTMLInputElement).checked = false;
    }
  };

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

  useEffect(() => {
    const newSelectedFilter = [
      ...selectedFilters.filter(e => tagLocFilter.tag.includes(e)),
      ...selectedFilters.filter(e => tagLocFilter.loc.includes(e))
    ];

    setSelectedFilters(newSelectedFilter);
    handleViewAllForFilters(newSelectedFilter, tags, locs);
  }, [tagLocFilter]);

  useEffect(() => {
    const { depts, tags, locs }: Facets = facets;

    if (selectedDept?.length && depts?.length && tags?.length && locs?.length) {
      selectFilter("depts", showMore["depts"]);
      selectFilter("tags", false);
      selectFilter("locs", false);
      setShowMore({
        ...showMore,
        depts: showMore["depts"],
        tags: false,
        locs: false
      });
      setSelectedFilters([...appliedFilters]);
      handleViewAll(appliedFilters, selectedDept, tags, locs);
    }
  }, [facets]);

  const clearFilter = () => {
    (document.getElementById("tag_all") as HTMLInputElement).checked = false;

    (document.getElementById("loc_all") as HTMLInputElement).checked = false;

    setAppliedFilters([]);
    setSelectedFilters([]);
  };

  useEffect(() => {
    clearFilter();
  }, [reset]);

  const toggle = (key: string) => {
    selectFilter(key, !showMore[key]);
    setShowMore({ ...showMore, [key]: !showMore[key] });
  };

  const handleCheckbox = (e: any, key: string) => {
    let newList = clone(selectedFilters);
    let newDeptList = clone(selectedDept);

    if (e.target.checked) {
      if (e.target.name === "View All") {
        const newArr = facets[key].map((e: any) => e?.name || e?.title);
        if (key === "depts") {
          newDeptList = [...new Set([...newDeptList, ...newArr])];

          setSelectedDept(newDeptList);
        } else {
          newList = [...new Set([...newList, ...newArr])];
          setSelectedFilters(newList);
        }
      } else {
        if (key === "depts") {
          newDeptList = [...new Set([...newDeptList, e.target.name])];
          setSelectedDept(newDeptList);
        } else {
          newList = [...new Set([...newList, e.target.name])];
          setSelectedFilters(newList);
        }
      }
    } else {
      if (e.target.name === "View All") {
        const newArr = facets[key].map((e: any) => e?.name || e.title);
        if (key !== "depts") {
          newList = [...new Set(newList.filter(el => !newArr.includes(el)))];
          setSelectedFilters(newList);
        }
      } else {
        if (key === "depts" && newDeptList.length > 1) {
          newDeptList = [
            ...new Set(newDeptList.filter(ele => ele !== e.target?.name))
          ];
          setSelectedDept(newDeptList);
        } else {
          newList = [...new Set(newList.filter(ele => ele !== e.target?.name))];
          setSelectedFilters(newList);
        }
      }
    }

    handleViewAll(newList, newDeptList, tags, locs);

    setAppliedFilters([...newList]);
    setSelectedDept(newDeptList);
  };

  const removeFilter = (name: string) => {
    const newList = clone(selectedFilters);
    const tagsList = clone(tags.map(e => e.name));
    const locList = clone(locs.map(e => e.name));

    if (
      newList.filter(ele => ele !== name).filter(ele => tagsList.includes(ele))
        .length
    ) {
      (document.getElementById("tag_all") as HTMLInputElement).checked = false;
    }

    if (
      newList.filter(ele => ele !== name).filter(ele => locList.includes(ele))
        .length
    ) {
      (document.getElementById("loc_all") as HTMLInputElement).checked = false;
    }

    setSelectedFilters(newList.filter(ele => ele !== name));
    setAppliedFilters([...newList.filter(ele => ele !== name)]);
  };

  const handleCancel = () => {
    setSelectedDept([...oldStateOfFilters?.dept]);
    setAppliedFilters([...oldStateOfFilters?.filters]);
    setSelectedFilters([...oldStateOfFilters?.filters]);
    handleViewAll(
      oldStateOfFilters?.filters,
      oldStateOfFilters?.dept,
      tags,
      locs
    );
    setOldStateOfFilters({ dept: [], filters: [] });
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      <div
        className={cs(
          mobile ? bootstrap.col12 : bootstrap.col3,
          listing.career_list_wrp_left,
          isFilterOpen ? listing.show : "",
          isFilterOpen ? listing.showFilter : ""
        )}
      >
        <ul>
          <li
            className={cs(
              listing.filter_li,
              selectedFilters?.length === 0 ||
                selectedFilters.length ===
                  facets?.tags.length + facets?.locs.length
                ? listing.filter_li_hide
                : ""
            )}
          >
            <div
              className={cs(
                listing.firstFilter,
                mobile ? listing.filter_applied : listing.filter_label_open
              )}
            >
              Filters Applied
              {mobile ? (
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconCrossNarrowBig,
                    listing.crossIcon
                  )}
                  onClick={() => {
                    mobile ? setIsFilterOpen(!isFilterOpen) : null;
                  }}
                ></i>
              ) : null}
            </div>

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
            <div
              className={cs(
                hideFilter["depts"]
                  ? listing.filter_label
                  : listing.filter_label_open
              )}
              onClick={() =>
                setHideFilter({ ...hideFilter, depts: !hideFilter["depts"] })
              }
            >
              By Department{" "}
            </div>

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
                  <label htmlFor={"dept_all"}>{`View All`}</label>
                </li>
                {depts?.map((ele, i) => (
                  <li key={i}>
                    <input
                      id={"dept_" + i}
                      type="checkbox"
                      name={ele?.title}
                      checked={selectedDept.includes(ele?.title)}
                      onChange={e => handleCheckbox(e, "depts")}
                    />
                    <label
                      htmlFor={"dept_" + i}
                    >{`${ele?.title} (${ele?.count})`}</label>
                  </li>
                ))}
                {facets?.depts?.length > 4 ? (
                  <li>
                    <button
                      className={listing.see_more_btn}
                      onClick={() => toggle("depts")}
                    >
                      {showMore.depts ? "- Show Less" : "+ Show More"}
                    </button>
                  </li>
                ) : null}
              </ul>
            </div>
          </li>

          <li className={listing.filter_li}>
            <div
              className={cs(
                hideFilter["tags"]
                  ? listing.filter_label
                  : listing.filter_label_open
              )}
              onClick={() =>
                setHideFilter({ ...hideFilter, tags: !hideFilter["tags"] })
              }
            >
              By Tags
            </div>

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
                  <label htmlFor={"tag_all"}>{`View All`}</label>
                </li>
                {tags?.map((ele, i) => (
                  <li
                    className={
                      tagLocFilter?.tag?.includes(ele?.name)
                        ? ""
                        : listing.disable_label
                    }
                    key={i}
                  >
                    <input
                      id={"tags_" + i}
                      type="checkbox"
                      name={ele?.name}
                      checked={selectedFilters.includes(ele?.name)}
                      onChange={e => handleCheckbox(e, "tags")}
                      disabled={!tagLocFilter?.tag?.includes(ele?.name)}
                    />
                    <label
                      htmlFor={"tags_" + i}
                    >{`${ele?.name} (${ele?.count})`}</label>
                  </li>
                ))}
                {facets?.tags?.length > 4 ? (
                  <li>
                    <button
                      className={listing.see_more_btn}
                      onClick={() => toggle("tags")}
                    >
                      {showMore.tags ? "- Show Less" : "+ Show More"}
                    </button>
                  </li>
                ) : null}
              </ul>
            </div>
          </li>

          <li className={listing.filter_li}>
            <div
              className={cs(
                hideFilter["locs"]
                  ? listing.filter_label
                  : listing.filter_label_open
              )}
              onClick={() =>
                setHideFilter({ ...hideFilter, locs: !hideFilter["locs"] })
              }
            >
              By Location
            </div>

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
                  <label htmlFor={"loc_all"}>{`View All`}</label>
                </li>
                {locs?.map((ele, i) => (
                  <li
                    className={
                      tagLocFilter?.loc?.includes(ele?.name)
                        ? ""
                        : listing.disable_label
                    }
                    key={i}
                  >
                    <input
                      id={"locs_" + i}
                      type="checkbox"
                      name={ele?.name}
                      checked={selectedFilters.includes(ele?.name)}
                      onChange={e => handleCheckbox(e, "locs")}
                      disabled={!tagLocFilter?.loc?.includes(ele?.name)}
                    />
                    <label
                      htmlFor={"locs_" + i}
                    >{`${ele?.name} (${ele?.count})`}</label>
                  </li>
                ))}
                {facets?.locs?.length > 4 ? (
                  <li>
                    <button
                      className={listing.see_more_btn}
                      onClick={() => toggle("locs")}
                    >
                      {showMore.locs ? "- Show Less" : "+ Show More"}
                    </button>
                  </li>
                ) : null}
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
        onClick={() => {
          setOldStateOfFilters({ dept: selectedDept, filters: appliedFilters });
          setIsFilterOpen(!isFilterOpen);
        }}
      >
        <span>FILTERS APPLIED ({selectedFilters.length})</span>
      </div>
      <div
        className={cs(
          listing.filter_mobile_button,
          isFilterOpen ? "" : listing.filter_mobile_hide
        )}
      >
        <button className={listing.cancel_btn} onClick={() => handleCancel()}>
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
