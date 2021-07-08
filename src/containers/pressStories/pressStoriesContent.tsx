import React, { RefObject } from "react";
import PressStoriesSubComponent from "./pressStoriesSubComponent";
import {
  PressStory,
  PressStoriesResponse,
  PressStoryEnquiryData
} from "./typings";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import cs from "classnames";
import SecondaryHeader from "components/SecondaryHeader";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import PressStoryService from "services/pressStory";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import FormTextArea from "components/Formsy/FormTextArea";
import iconStyles from "styles/iconFonts.scss";
import * as valid from "utils/validate";
import { AppState } from "reducers/typings";
import { removeFroala } from "utils/validate";

type Props = {
  year: number;
  content: PressStory[];
  options: DropdownItem[];
  history: any;
  readMore: (url: string) => void;
  updatePressStoriesData: (data: PressStoriesResponse) => void;
  mobile: boolean;
};

type State = {
  storiesData: PressStory[];
  isSortOpen: boolean;
  successmsg: string;
  mobileScreen: "overflow hidden-xs hidden-sm";
  defaultOption: DropdownItem;
  emailErr: string;
  msgErr: string;
  submitMobile: "summary-footer hidden-xs hidden-sm";
  contactUs: "summary-padding cerise-btn";
  arrow: "icon icon_uparrow-black";
  showMobileForm: boolean;
  enableSubmit: boolean;
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchPressStories: async (year: number) => {
      const res = await PressStoryService.fetchPressStories(
        dispatch,
        year.toString()
      );
      return res;
    },
    submitPressStoryEnquiry: async (data: PressStoryEnquiryData) => {
      const res = await PressStoryService.submitPressStoryEnquiry(
        dispatch,
        data
      );
      return res;
    }
  };
};
const mapStateToProps = (state: AppState) => {
  return {
    showTimer: state.info.showTimer
  };
};

class PressStoriesContent extends React.Component<
  Props &
    ReturnType<typeof mapDispatchToProps> &
    ReturnType<typeof mapStateToProps>,
  State
> {
  constructor(
    props: Props &
      ReturnType<typeof mapDispatchToProps> &
      ReturnType<typeof mapStateToProps>
  ) {
    super(props);
    this.state = {
      storiesData: this.props.content || [],
      isSortOpen: false,
      successmsg: "",
      mobileScreen: "overflow hidden-xs hidden-sm",
      defaultOption: this.props.year
        ? {
            value: this.props.year.toString(),
            label: this.props.year.toString()
          }
        : {
            value: new Date().getFullYear().toString(),
            label: new Date().getFullYear().toString()
          },
      emailErr: "",
      msgErr: "",
      submitMobile: "summary-footer hidden-xs hidden-sm",
      contactUs: "summary-padding cerise-btn",
      arrow: "icon icon_uparrow-black",
      enableSubmit: false,
      showMobileForm: false
    };
  }

  onClickFilter = (isOpen: boolean) => {
    this.setState({
      isSortOpen: !isOpen
    });
  };

  readMore = (data: number) => {
    this.props.readMore(this.state.storiesData[data].url);
  };

  showHide = () => {
    this.setState(prevState => ({
      showMobileForm: !prevState.showMobileForm
    }));
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    removeFroala();
  }

  onSelect = (data: DropdownItem) => {
    this.onChangeFilter(data.value);
  };
  onChangeFilter = (year?: string) => {
    if (year) {
      this.setState({
        defaultOption: { value: year, label: year }
      });

      // valid.sortGTM(year);
      this.props.fetchPressStories(parseInt(year)).then(data => {
        this.props.updatePressStoriesData(data);
        const len = location.pathname.split("/").length;
        const pathArray = location.pathname.split("/");
        pathArray[len - 1] = year.toString();
        this.props.history.push(pathArray.join("/"), {});
        document.body.classList.remove(globalStyles.noscroll);
      });
      window.scrollTo(0, 0);
    }
  };
  PressStoriesFormRef: RefObject<Formsy> = React.createRef();

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    const { email, publication, message } = model;
    const data = { email, publication: publication || "", message };
    this.props
      .submitPressStoryEnquiry(data)
      .then(res => {
        this.setState({
          successmsg:
            "Thank you for contacting us. We will revert to you shortly!"
        });
        resetForm();
      })
      .catch(error => {
        const errorObj = error.response.data.message;
        if (typeof errorObj == "object") {
          updateInputsWithError(errorObj);
          const errors = Object.entries(errorObj).map(([key, value]) => value);
          valid.errorTracking(errors as string[], location.href);
        } else if (typeof errorObj == "string") {
          this.setState({ successmsg: errorObj });
          valid.errorTracking([errorObj], location.href);
        }
        // console.log(error);
      });
  };

  render() {
    const formContent = (
      <div
        className={cs(styles.loginForm, globalStyles.voffset4, {
          [styles.summaryPadding]: this.props.mobile
        })}
      >
        <Formsy
          ref={this.PressStoriesFormRef}
          onValidSubmit={this.handleSubmit}
          onValid={() => this.setState({ enableSubmit: true, successmsg: "" })}
          onInvalid={() => this.setState({ enableSubmit: false })}
          //   onInvalidSubmit={this.handleInvalidSubmit}
        >
          <div className={styles.categorylabel}>
            <div>
              <FormInput
                name="email"
                placeholder={"Email"}
                label={"Email"}
                keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                validations={{
                  isEmail: true,
                  isExisty: true,
                  maxLength: 75
                }}
                validationErrors={{
                  isEmail: "Please enter a valid Email ID",
                  isExisty: "Please enter your Email ID",
                  maxLength: "You are allowed to enter upto 75 characters only"
                }}
                required
              />
            </div>
            <div>
              <FormInput
                name="publication"
                placeholder="Publication"
                label="Publication"
                keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              />
            </div>
            <div>
              <FormTextArea
                name="message"
                placeholder="Insert your message here, along with your contact details..."
                label="Message"
                keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                validations={{
                  isExisty: true
                }}
                validationErrors={{
                  isExisty: "Please enter your message"
                }}
                required
              />
            </div>
            <div>
              {this.state.successmsg ? (
                <p className={globalStyles.errorMsg}>{this.state.successmsg}</p>
              ) : (
                ""
              )}
              <input
                type="submit"
                disabled={!this.state.enableSubmit}
                className={cs(
                  { [styles.summaryFooter]: this.props.mobile },
                  this.state.enableSubmit
                    ? globalStyles.ceriseBtn
                    : cs(globalStyles.disabledBtn, globalStyles.ceriseBtn)
                )}
                value="submit"
              />
            </div>
          </div>
        </Formsy>
      </div>
    );
    return (
      <div
        className={cs(
          { [styles.press]: !this.props.mobile },
          { [styles.pressMobile]: this.props.mobile },
          styles.containerStartPress,
          { [styles.containerStartPressTimer]: this.props.showTimer },
          ""
        )}
      >
        {!this.props.mobile ? (
          <SecondaryHeader>
            <div
              className={cs(
                bootstrapStyles.colMd7,
                bootstrapStyles.offsetMd1,
                styles.header,
                globalStyles.verticalMiddle
              )}
            >
              <div>
                <span className={styles.heading}>PRESS &amp; MEDIA</span>
              </div>
            </div>
            <div
              className={cs(
                bootstrapStyles.colMd3,
                bootstrapStyles.offsetMd1,
                globalStyles.verticalMiddle
              )}
            >
              <p className={styles.filterText}>ARCHIVE</p>
              <SelectableDropdownMenu
                id="filter-dropdown-pressstories"
                align="right"
                className={styles.dropdownRoot}
                items={this.props.options}
                value={this.state.defaultOption.value as string}
                onChange={this.onChangeFilter}
                showCaret={true}
              ></SelectableDropdownMenu>
            </div>
          </SecondaryHeader>
        ) : (
          <div className={styles.cSort}>
            <div
              className={
                this.state.isSortOpen
                  ? globalStyles.hidden
                  : cs(bootstrapStyles.col12, styles.productNumber)
              }
            >
              <div
                className={cs(styles.cSortHeader, {
                  [styles.cSortHeaderTimer]: this.props.showTimer
                })}
              >
                {
                  <div
                    className={styles.collectionHeader}
                    onClick={this.onClickFilter.bind(this, false)}
                  >
                    <span>archive</span>
                    <span className={styles.yrRight}>
                      {this.state.defaultOption.label
                        ? this.state.defaultOption.label
                        : this.state.defaultOption}
                    </span>
                  </div>
                }
              </div>
            </div>
            <div
              className={
                this.state.isSortOpen
                  ? cs(bootstrapStyles.col12, styles.productNumber)
                  : globalStyles.hidden
              }
            >
              <div>
                <div
                  className={cs(styles.mobileFilterHeader, {
                    [styles.mobileFilterHeaderTimer]: this.props.showTimer
                  })}
                >
                  <span>ARCHIVE</span>
                  <span onClick={this.onClickFilter.bind(this, true)}>
                    <i
                      className={cs(
                        iconStyles.icon,
                        iconStyles.iconCrossNarrowBig
                      )}
                    ></i>
                  </span>
                </div>
                <div
                  className={cs(bootstrapStyles.row, globalStyles.minimumWidth)}
                >
                  <div
                    className={cs(
                      bootstrapStyles.col12,
                      bootstrapStyles.col12,
                      styles.mobileFilterMenu,
                      { [styles.mobileFilterMenuTimer]: this.props.showTimer }
                    )}
                  >
                    <ul className={styles.sort}>
                      {this.props.options
                        ? this.props.options.map((items, index) => {
                            return (
                              <li
                                key={index}
                                onClick={e => this.onSelect(items)}
                              >
                                {items.value}
                              </li>
                            );
                          })
                        : ""}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={bootstrapStyles.row}>
          <div
            className={cs(bootstrapStyles.colMd9, bootstrapStyles.col12, {
              [globalStyles.paddTop20]: !this.props.mobile
            })}
          >
            {this.state.storiesData.map((items, index) => {
              return (
                <PressStoriesSubComponent
                  key={index}
                  data={items}
                  readMore={() => this.readMore(index)}
                />
              );
            })}
          </div>
          {!this.props.mobile && (
            <div
              className={cs(
                bootstrapStyles.colMd3,
                styles.filterSticky,
                styles.blockRight,
                styles.overflowy
              )}
            >
              <div className={styles.heading}>contact us</div>
              <div className={styles.para}>
                For additional press information and media enquiries please send
                an email to{" "}
                <a href="mailto:mediarelations@goodearth.in">
                  mediarelations@goodearth.in
                </a>
              </div>
              <div className={cs(styles.para, globalStyles.voffset3)}>
                {" "}
                Alternatively you may get in touch with us through the contact
                form below:
              </div>
              {formContent}
            </div>
          )}
        </div>
        {this.props.mobile && (
          <div
            className={cs(
              bootstrapStyles.col12,
              bootstrapStyles.colMd4
              // styles.fixOrdersummary
            )}
          >
            <div
              className={cs(
                styles.orderSummary,
                styles.pressStories,
                styles.blockRight
              )}
            >
              <div
                className={cs(
                  styles.summaryPadding,
                  this.state.showMobileForm
                    ? styles.heading
                    : globalStyles.ceriseBtn
                )}
              >
                contact us
              </div>
              <div
                className={cs(styles.overflow, {
                  [globalStyles.hidden]: !this.state.showMobileForm
                })}
              >
                <div className={cs(styles.para, styles.summaryPadding)}>
                  For additional press information and media enquiries please
                  send an email to{" "}
                  <a href="mailto:mediarelations@goodearth.in">
                    mediarelations@goodearth.in
                  </a>
                </div>
                <div
                  className={cs(
                    styles.para,
                    globalStyles.voffset3,
                    styles.summaryPadding
                  )}
                >
                  {" "}
                  Alternatively you may get in touch with us through the contact
                  form below:
                </div>
                {formContent}
              </div>

              <span
                className={cs(styles.btnArrow, globalStyles.colorPrimary)}
                onClick={this.showHide}
              >
                <i
                  className={
                    this.state.showMobileForm
                      ? cs(iconStyles.icon, iconStyles.icon_downarrowblack)
                      : cs(iconStyles.icon, iconStyles.icon_uparrowblack)
                  }
                ></i>
              </span>
              {/* <div className={this.state.submitMobile}>
                        <input type="submit"
                                className={ this.state.enableSubmit ? "cerise-btn" : "cerise-btn disabled-btn"}
                                value="submit" onClick={this.formSubmit}/>
                    </div> */}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PressStoriesContent);
