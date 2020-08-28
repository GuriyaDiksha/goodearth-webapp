import React, { RefObject } from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import FormInput from "../../../../components/Formsy/FormInput";
import Formsy from "formsy-react";
import { TrackOrderProps, State } from "./typings";
import TrackDetails from "./trackOrderDetail";
import mapDispatchToProps from "../MyOrder/mapper/actions";
import { AppState } from "reducers/typings";

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user,
    mobile: state.device.mobile
  };
};
type Props = TrackOrderProps &
  ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

class TrackOrder extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    props.setCurrentSection();
    this.state = {
      showerror: "",
      updateSubmit: false,
      orderData: {},
      trackingData: {},
      showTracking: false,
      loader: false
    };
  }

  TrackOrderFormRef: RefObject<Formsy> = React.createRef();
  emailInput: RefObject<HTMLInputElement> = React.createRef();
  //   TrackOrderFormRef: RefObject<Formsy> = React.createRef();

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    const { email, orderNumber } = model;
    this;
    this.setState({ loader: true });
    this.props.fetchOrderBy(orderNumber, email).then((response: any) => {
      if (response.count == 0) {
        // resetForm();
        this.setState({
          showerror: "Order not found, please recheck the information entered.",
          loader: false
        });
      } else {
        if (response.count >= 0) {
          // debugger;
          this.props
            .fetchCourierData("12279930917")
            .then(data => {
              this.setState({
                trackingData: data,
                orderData: response.results,
                showTracking: true,
                loader: false
              });
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.setState({
            showerror:
              "Order not found, please recheck the information entered.",
            loader: false
          });
        }
      }
    });
  };

  handleValid = () => {
    this.setState({
      updateSubmit: true
    });
  };

  handleInvalid = () => {
    if (this.state.updateSubmit == true) {
      this.setState({ updateSubmit: false });
    }
  };

  errorOnBlur = (event: React.FocusEvent<Element>) => {
    const elem = event.currentTarget as HTMLInputElement;
    const value = elem.value;
    const name = elem.name;

    if (!value) {
      this.TrackOrderFormRef.current &&
        this.TrackOrderFormRef.current.updateInputsWithValue(
          {
            [name]: ""
          },
          true
        );
    }
  };

  loginForms = () => {
    const { updateSubmit } = this.state;
    const {
      user: { email, isLoggedIn }
    } = this.props;
    return (
      <div className={cs(styles.loginForm, globalStyles.voffset4)}>
        <div>
          <Formsy
            ref={this.TrackOrderFormRef}
            onValidSubmit={this.handleSubmit}
            onValid={this.handleValid}
            onInvalid={this.handleInvalid}
          >
            <div className={styles.categorylabel}>
              <div>
                <FormInput
                  name="orderNumber"
                  placeholder={"Order Number"}
                  label={"Order Number"}
                  keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                  blur={e => this.errorOnBlur(e)}
                  required
                />
              </div>

              <div>
                <FormInput
                  name="email"
                  placeholder={"Email*"}
                  label={"Email*"}
                  value={isLoggedIn ? email : ""}
                  keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                  blur={e => this.errorOnBlur(e)}
                  inputRef={this.emailInput}
                  validations={{
                    isEmail: true,
                    maxLength: 75
                  }}
                  validationErrors={{
                    isEmail: "Enter valid email",
                    maxLength:
                      "You are allowed to enter upto 75 characters only"
                  }}
                  disable={isLoggedIn ? true : false}
                  inputClass={isLoggedIn ? styles.disabledInput : ""}
                  required
                />
              </div>
              <div>
                {this.state.showerror ? (
                  <p className={globalStyles.errorMsg}>
                    {this.state.showerror}
                  </p>
                ) : (
                  ""
                )}
                <input
                  type="submit"
                  disabled={!updateSubmit}
                  className={cs(
                    { [globalStyles.disabledBtn]: !updateSubmit },
                    globalStyles.ceriseBtn
                  )}
                  value={"CHECK ORDER STATUS"}
                />
              </div>
            </div>
          </Formsy>
        </div>
      </div>
    );
  };

  render() {
    const { showTracking } = this.state;
    return (
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colMd12
          )}
        >
          <div className={bootstrapStyles.row}>
            <div
              className={cs(
                bootstrapStyles.col10,
                { [bootstrapStyles.offset1]: this.props.mobile },
                bootstrapStyles.colMd10
              )}
            >
              <div className={styles.formHeading}>Track Order</div>
              <div className={styles.formSubheading}>
                Enter tracking number to track shipments and get delivery
                status.
              </div>
              {!showTracking && this.loginForms()}
              {showTracking && (
                <TrackDetails
                  orderData={this.state.orderData}
                  trackingData={this.state.trackingData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackOrder);
