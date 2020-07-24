import React, { RefObject } from "react";
import PressStoriesSubComponent from "./pressStoriesSubComponent";
import {
  PressStory,
  PressStoriesResponse,
  PressStoryEnquiryData
} from "./typings";
// import Dropdown from 'react-dropdown';
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
  // isSortOpen: false,
  // showData: true,
  // year: year ? year : new Date().getFullYear(),
  successmsg: string;
  mobileScreen: "overflow hidden-xs hidden-sm";
  defaultOption: DropdownItem;
  // options: this.props.options || [],
  // isSortOpen: false,
  emailErr: string;
  msgErr: string;
  // isliving: true,
  submitMobile: "summary-footer hidden-xs hidden-sm";
  contactUs: "summary-padding cerise-btn";
  // emailId: '',
  // msg: '',
  // publication: '',
  arrow: "icon icon_uparrow-black";
  // labelclass: false,
  // errorBorder: false,
  // labelmsg: false,
  // labelpub: false,
  // errorBorderMsg: false,
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
const mapStateToProps = () => {
  return {};
};

class PressStoriesContent extends React.Component<
  Props & ReturnType<typeof mapDispatchToProps>,
  State
> {
  // const year = this.props.year.toString();
  // let default_opt = year;
  constructor(props: Props & ReturnType<typeof mapDispatchToProps>) {
    super(props);
    this.state = {
      storiesData: this.props.content || [],
      // isSortOpen: false,
      // showData: true,
      // year: year ? year : new Date().getFullYear(),
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
      // options: this.props.options || [],
      // isSortOpen: false,
      emailErr: "",
      msgErr: "",
      // isliving: true,
      submitMobile: "summary-footer hidden-xs hidden-sm",
      contactUs: "summary-padding cerise-btn",
      // emailId: '',
      // msg: '',
      // publication: '',
      arrow: "icon icon_uparrow-black",
      // labelclass: false,
      // errorBorder: false,
      // labelmsg: false,
      // labelpub: false,
      // errorBorderMsg: false,
      enableSubmit: false,
      showMobileForm: false
    };
  }

  // onClickFilter(isopen) {
  //     this.setState({
  //         isSortOpen: !isopen
  //     })
  // }

  // formSubmit() {
  //     let email = this.state.emailId;
  //     let msg = this.state.msg;
  //     let lastAtPos = email.lastIndexOf('@');
  //     let lastDotPos = email.lastIndexOf('.');
  //     if (!email) {
  //         this.setState({
  //             emailErr: "Please enter email",
  //             errorBorder: true
  //         });
  //     }
  //     if (!msg) {
  //         this.setState({
  //             msgErr: "Please enter message",
  //             errorBorderMsg: true
  //         });
  //     }
  //     if (email) {
  //         if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
  //             this.setState({emailErr: "Enter valid email"});
  //         }
  //     }
  //     if ((email) && (msg) && ((lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2))) {
  //         let formData = new FormData();
  //         formData.append("email", email);
  //         formData.append("publication", this.state.publication);
  //         formData.append("message", msg);

  // }
  // }

  readMore = (data: number) => {
    this.props.readMore(this.state.storiesData[data].url);
  };

  // handleChange(event) {
  //     this.setState({value: event.target.value});
  // }

  showHide() {
    this.setState(prevState => ({
      showMobileForm: !prevState.showMobileForm
    }));
    //     let classValue = (this.state.mobileScreen == "overflow") ? "overflow hidden-xs hidden-sm" : "overflow";
    //     let classSubmit = (this.state.submitMobile == "summary-footer hidden-xs hidden-sm") ? "summary-footer" : "summary-footer hidden-xs hidden-sm";
    //     let contactUs = (this.state.contactUs == "heading summary-padding") ? "summary-padding cerise-btn" : "heading summary-padding";
    //     let arrow = (this.state.arrow == "icon icon_uparrow-black") ? "icon icon_downarrow-black" : "icon icon_uparrow-black";
    //     this.setState({
    //         mobileScreen: classValue,
    //         submitMobile: classSubmit,
    //         contactUs: contactUs,
    //         arrow: arrow
    //     });
  }

  // onClickFilter(isopen) {
  //     if (!isopen) {
  //         this.setState({
  //             mobileScreen: "overflow hidden-xs hidden-sm",
  //             submitMobile: "summary-footer hidden-xs hidden-sm",
  //             contactUs: "summary-padding cerise-btn",
  //             arrow: "icon icon_uparrow-black"
  //         });
  //         document.body.classList.add("noscroll");
  //     }
  //     else {
  //         document.body.classList.remove("noscroll");
  //     }
  //     this.setState({
  //         isSortOpen: !isopen
  //     })
  // }

  // onClickFilteData(data) {
  //     document.body.classList.remove("noscroll");
  //     this.setState({
  //         isSortOpen: false
  //     })
  // }

  // emailValid(e) {
  //     this.setState({
  //         emailId: e.target.value,
  //         successmsg: '',
  //         labelclass: true
  //     });
  //     let email = e.target.value;
  //     let lastAtPos = email.lastIndexOf('@');
  //     let lastDotPos = email.lastIndexOf('.');
  //     if (!email) {
  //         this.setState({
  //             emailErr: "Please enter email",
  //             errorBorder: true
  //         });
  //     }
  //     else {
  //         if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
  //             this.setState({
  //                 emailErr: "Enter valid email",
  //                 errorBorder: true
  //             });
  //         }
  //         else {
  //             this.setState({
  //                 emailErr: "",
  //                 errorBorder: false,
  //                 enableSubmit: true
  //             });
  //         }
  //     }
  // }

  // msgValid(e) {
  //     this.setState({
  //         msg: e.target.value,
  //         successmsg: '',
  //         labelmsg: true,
  //         errorBorderMsg: true
  //     });
  //     let msg = e.target.value;
  //     if (!msg) {
  //         this.setState({
  //             msgErr: "Please enter message",
  //             labelmsg: true,
  //             errorBorderMsg: true
  //         });
  //     }
  //     else {
  //         this.setState({
  //             msgErr: "",
  //             labelmsg: true,
  //             errorBorderMsg: false,
  //             enableSubmit: true
  //         });
  //     }
  // }

  // publicationValid(e) {
  //     this.setState({
  //         publication: e.target.value,
  //         successmsg: '',
  //         labelpub: true
  //     });
  // }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onChangeFilter = (data?: string) => {
    if (data) {
      this.setState({
        defaultOption: { value: data, label: data }
      });

      this.props.fetchPressStories(parseInt(data)).then(data => {
        const len = location.pathname.split("/").length;
        const pathArray = location.pathname.split("/");
        pathArray[len - 1] = data.toString();
        history.pushState({}, pathArray.join("/"));
        this.setState({
          storiesData: data.data
          // isSortOpen: false
        });
        this.props.updatePressStoriesData(data);
        document.body.classList.remove("noscroll");
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
          // emailErr: '',
          // msgErr: '',
          // emailId: '',
          // publication: '',
          // msg: ''
        });
        resetForm();
      })
      .catch(error => {
        const errorObj = error.response.data.message;
        if (typeof errorObj == "object") {
          updateInputsWithError(errorObj);
        } else if (typeof errorObj == "string") {
          this.setState({ successmsg: errorObj });
        }
        // console.log(error);
      });
  };

  render() {
    const formContent = (
      <div className={cs(styles.loginForm, globalStyles.voffset4)}>
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
                // inputRef={emailInput}
                validations={{
                  isEmail: true,
                  isExisty: true,
                  maxLength: 75
                }}
                validationErrors={{
                  isEmail: "Enter valid email",
                  isExisty: "Please enter email",
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
                  isExisty: "Please enter message"
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
                className={
                  this.state.enableSubmit
                    ? globalStyles.ceriseBtn
                    : cs(globalStyles.disabledBtn, globalStyles.ceriseBtn)
                }
                value="submit"
              />
            </div>
          </div>
        </Formsy>
      </div>
    );
    return (
      <div className={styles.press}>
        {!this.props.mobile ? (
          // <div>
          //     <div className="breadcrumbs-block">
          //         <div className="row dropdown-header minimumWidth">
          //             <div className="bootstrapStyles.colMd7 bootstrapStyles.colMdoffset-1 pdp_breadcrumbs">
          //                 <span><a>PRESS &amp; MEDIA</a></span>
          //             </div>
          //             <div className="bootstrapStyles.colMd3 custom-dropdown bootstrapStyles.colMdoffset-1 pdp_sortmenu">
          //                 {/* <div className="drop-div"><span>Archive</span>
          //                     <Dropdown options={this.props.options} onChange={(e) => this.onSelect(e)}
          //                               value={this.state.defaultOption} placeholder="Select an option"/>
          //                 </div> */}
          //             </div>
          //         </div>
          //     </div>
          // </div>
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
          <div className="c-sort">
            {/* <div className={this.state.isSortOpen?"hidden":"bootstrapStyles.col12 product-number"}>
                        <div className="c-sort-header">
                            { 
                                <div className="collection-header" onClick={this.onClickFilter.bind(this,false)}>
                                    <span>archive</span><span
                                    className="yr-right">{this.state.defaultOption.label ? this.state.defaultOption.label : this.state.defaultOption}</span>
                                </div>
                        }
                        </div>
                    </div> */}
            {/* <div className={this.state.isSortOpen?"bootstrapStyles.col12 product-number ":"hidden"}>
                        <div>
                            <div className="mobile-filter-header hidden-md hidden-lg">
                                <span>ARCHIVE</span>
                                <span onClick={this.onClickFilter.bind(this,true)}>X</span>
                            </div>
                            <div className="row minimumWidth">
                                <div className="bootstrapStyles.col12 bootstrapStyles.colsm-12 mobile-filter-menu ">
                                    <ul className="sort hidden-md hidden-lg">
                                        {this.props.options ? this.props.options.map((items, index) => {
                                            return <li onClick={(e) => this.onSelect(items)}>{items.value}</li>
                                        }) : ""}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div> */}
          </div>
        )}
        <div className={bootstrapStyles.row}>
          <div
            className={cs(
              bootstrapStyles.colMd9,
              bootstrapStyles.col12,
              globalStyles.paddTop20
            )}
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
              {/* <div className="login-form">

                            <ul className="categorylabel">
                                <li><input type="text" placeholder={'Email'}
                                           value={this.state.emailId}
                                           className={this.state.errorBorder ? "error-border" : ""}
                                           onChange={this.emailValid}
                                           onClick={this.emailValid}
                                />
                                    <label className={this.state.labelclass ? "label" : "label hidden" }>
                                        Email</label>
                                    <p className="enquire-error-msg">{this.state.emailErr}</p>
                                </li>
                                <li>
                                    <input type="text" placeholder={'Publication'} label={'Publication'}
                                           value={this.state.publication} onChange={this.publicationValid} onClick={this.publicationValid}/>
                                    <label className={this.state.labelpub ? "label" : "label hidden" }>
                                        Publication</label>
                                    <p className="enquire-error-msg"></p>
                                </li>
                                <li>
                                    <textarea
                                        placeholder="Insert your message here, along with your contact details..."
                                        value={this.state.msg}
                                        className={this.state.errorBorderMsg ? "error-border" : ""}
                                        onChange={this.msgValid}
                                        onClick={this.msgValid}
                                    />
                                    <label className={this.state.labelmsg ? "label" : "label hidden" }>
                                        Message</label>
                                    <p className="enquire-error-msg">{this.state.msgErr}</p>
                                    <p className="enquire-error-msg txtnormal">{this.state.successmsg}</p>
                                </li>
                                <li><input type="submit"
                                           className={ this.state.enableSubmit ? "cerise-btn" : "cerise-btn disabled-btn"}
                                           disabled={!this.state.enableSubmit}
                                           value="submit"
                                           onClick={this.formSubmit}/></li>
                            </ul>
                        </div> */}
            </div>
          )}
        </div>
        {this.props.mobile && (
          <div
            className={cs(
              bootstrapStyles.col12,
              bootstrapStyles.colMd4,
              styles.fixOrdersummary
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
                  [styles.hidden]: !this.state.showMobileForm
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
                {/* <div className="login-form summary-padding">
                            <ul>
                                <li><input type="text" placeholder={'Email'} label={'Email'}
                                            value={this.state.emailId}
                                            className={this.state.errorBorder ? "error-border" : ""}
                                            onChange={this.emailValid}/>
                                    <label className={this.state.labelclass ? "label" : "label hidden" }>
                                        Email</label>
                                    <p className="error-msg">{this.state.emailErr}</p>
                                </li>
                                <li>
                                    <input type="text" placeholder={'Publication'} label={'Publication'}
                                            value={this.state.publication} onChange={this.publicationValid}/>
                                </li>
                                <li>
                                <textarea
                                    placeholder="Insert your message here, along with your contact details..."
                                    value={this.state.msg}
                                    className={this.state.errorBorderMsg ? "error-border" : ""}
                                    onChange={this.msgValid}
                                />
                                    <label className={this.state.labelmsg ? "label" : "label hidden" }>
                                        Message</label>
                                    <p className="error-msg">{this.state.msgErr}</p>
                                    <p className="error-msg txtnormal text-center">{this.state.successmsg}</p>
                                </li>
                            </ul>
                        </div> */}
              </div>

              <span
                className="btn-arrow visible-xs color-primary"
                onClick={this.showHide}
              >
                <i className={this.state.arrow}></i>
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
