import React, { RefObject } from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import FormInput from "../../../../components/Formsy/FormInput";
import Formsy from "formsy-react";
import { PasswordProps, State } from "./typings";
import mapDispatchToProps from "../MyOrder/mapper/actions";
import { AppState } from "reducers/typings";

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user
  };
};
type Props = PasswordProps &
  ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

class TrackOrder extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    props.setCurrentSection();
    this.state = {
      showerror: "",
      updateSubmit: false
    };
  }

  ProfileFormRef: RefObject<Formsy> = React.createRef();
  emailInput: RefObject<HTMLInputElement> = React.createRef();
  //   ProfileFormRef: RefObject<Formsy> = React.createRef();

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    const { email, ordernumber } = model;

    this.props.fetchOrderBy(ordernumber, email).then((response: any) => {
      if (response.count == 0) {
        // resetForm();
        this.setState({
          showerror: "No Order Found"
        });
      } else {
        // Object.keys(response.error_message).map(data => {
        //   switch (data) {
        //     case "ordernumber":
        //       updateInputsWithError(
        //         {
        //           [data]: response.error_message[data][0]
        //         },
        //         true
        //       );
        //       break;
        //     case "email":
        //       updateInputsWithError(
        //         {
        //             email: response.error_message[data][0]
        //         },
        //         true
        //       );
        //       break;
        //   }
        // });
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

  render() {
    const { updateSubmit } = this.state;
    const {
      user: { email, isLoggedIn }
    } = this.props;
    return (
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colMd8,
            bootstrapStyles.offsetMd2
          )}
        >
          <div className={styles.formHeading}>Track Order</div>
          <div className={styles.formSubheading}>
            Enter tracking number to track shipments and get delivery status.
          </div>
          <div className={cs(styles.loginForm, globalStyles.voffset4)}>
            <div>
              <Formsy
                ref={this.ProfileFormRef}
                onValidSubmit={this.handleSubmit}
                onValid={this.handleValid}
                onInvalid={this.handleInvalid}
              >
                <div className={styles.categorylabel}>
                  <div>
                    <FormInput
                      name="ordernumber"
                      placeholder={"Order Number"}
                      label={"Order Number"}
                      keyPress={e =>
                        e.key == "Enter" ? e.preventDefault() : ""
                      }
                      required
                    />
                  </div>

                  <div>
                    <FormInput
                      name="email"
                      placeholder={"Email*"}
                      label={"Email*"}
                      value={isLoggedIn ? email : ""}
                      keyPress={e =>
                        e.key == "Enter" ? e.preventDefault() : ""
                      }
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
                      <p className={styles.loginErrMsg}>
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
                      value={updateSubmit ? "CHECK ORDER STATUS" : "Updated"}
                    />
                  </div>
                </div>
              </Formsy>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackOrder);
