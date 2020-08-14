import React from "react";
// import Modal from './Modal';
import FormInput from "components/Formsy/FormInput";
import Formsy from "formsy-react";
// import Axios from 'axios';
// import Config from "components/config";
import HeaderService from "services/headerFooter";
import { Dispatch } from "redux";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import { Context } from "components/Modal/context";
import iconStyles from "styles/iconFonts.scss";
import globalStyles from "../../../styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    checkPinCodeShippable: async (pinCode: string) => {
      const res = await HeaderService.checkPinCodeShippable(dispatch, pinCode);
      return res;
    }
  };
};

const mapStateToProps = (state: AppState) => {
  return {};
};

type Props = {
  setPincode: (pincode: string) => void;
} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  status: string;
  disableSubmit: boolean;
};

class PincodePopup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      status: "",
      disableSubmit: true
    };
  }
  static contextType = Context;
  componentDidMount() {
    const defaultPincode = localStorage.getItem("selectedPincode");
    if (defaultPincode) {
      this.setState({
        disableSubmit: false
      });
      this.pincodeFormRef.current?.updateInputsWithValue({
        pinCode: defaultPincode
      });
    }
    this.pincodeInput.current?.focus();
  }

  checkPincode(pinCode: string) {
    // const pincode = this.refs.pincodeRef.state.value;
    this.props
      .checkPinCodeShippable(pinCode)
      .then(data => {
        this.setState({ status: "yes" });
        localStorage.setItem("selectedPincode", pinCode);
        this.props.setPincode(pinCode);
      })
      .catch(err => {
        this.setState({ status: "no" });
        console.log(err);
      });
  }
  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const pincode = event.target.value;
    pincode.toString().length >= 6
      ? this.setState({ disableSubmit: false })
      : this.setState({ disableSubmit: true });
  }

  pincodeInput = React.createRef<HTMLInputElement>();
  pincodeFormRef = React.createRef<Formsy>();

  handleSubmit = (model: any, resetForm: any, invalidateForm: any) => {
    const { pinCode } = this.pincodeFormRef.current?.getModel();
    this.state.disableSubmit ? null : this.checkPincode(pinCode);
  };
  render() {
    const { closeModal } = this.context;
    const pincodeForm = (
      <div>
        <div className={cs(globalStyles.c22AI, globalStyles.voffset7)}>
          We have resumed deliveries Pan India.
        </div>
        <div className={globalStyles.c10LR}>
          <p>
            We have resumed Shipping in India as per Government directives.
            Enter your Pincode to check if your location is serviceable as on
            date.
          </p>
        </div>
        <div className={styles.loginForm}>
          <Formsy ref={this.pincodeFormRef} onSubmit={this.handleSubmit}>
            <ul className={styles.categorylabel}>
              <li>
                <FormInput
                  name="pinCode"
                  type="number"
                  maxlength={6}
                  inputRef={this.pincodeInput}
                  placeholder={"Enter Delivery Pincode"}
                  label={"Pincode"}
                  handleChange={e => this.handleChange(e)}
                  // border={this.state.highlight}
                  // error={this.state.msg ? this.state.msg : this.state.showerror}
                />
              </li>
              <li>
                <input
                  type="submit"
                  disabled={this.state.disableSubmit}
                  value="Check Pincode"
                  className={cs(globalStyles.ceriseBtn, {
                    [globalStyles.disabledBtn]: this.state.disableSubmit
                  })}
                />
              </li>
            </ul>
          </Formsy>
        </div>
      </div>
    );
    const pincodeSuccess = (
      <div>
        <div className={cs(globalStyles.c22AI, globalStyles.voffset7)}>
          Start shopping!
        </div>
        <div className={globalStyles.c10LR}>
          <p>
            We are currently delivering to your area.
            <br /> We will keep you informed in case of any delays due to Covid
            19 restrictions in your area.
          </p>
        </div>
        <div className={styles.loginForm}>
          <form>
            <ul className={styles.categorylabel}>
              <li>
                <button className={globalStyles.ceriseBtn} onClick={closeModal}>
                  Start shopping
                </button>
              </li>
            </ul>
          </form>
        </div>
      </div>
    );
    const pincodeFail = (
      <div>
        <div className={cs(globalStyles.c22AI, globalStyles.voffset7)}>
          Pincode Not Serviceable
        </div>
        <div className={globalStyles.c10LR}>
          <p>
            As per defined Covid 19 restrictions, we will not be able to deliver
            to your Pincode at the moment.
          </p>
          <p>
            You are welcome to place an order and we will try to deliver it as
            soon as your area opens up.
          </p>
        </div>
        <div className={styles.loginForm}>
          <form>
            <ul className={styles.ategorylabel}>
              <li>
                <div
                  className={cs(globalStyles.ceriseBtn, styles.bigBtn)}
                  onClick={() =>
                    this.setState({ status: "" }, () =>
                      this.pincodeInput.current?.focus()
                    )
                  }
                >
                  Check another pincode
                </div>
              </li>
            </ul>
          </form>
        </div>
      </div>
    );
    return (
      // <div className={cs(styles.size-block size-block-1 size-block-not-fixed centerpage-desktop centerpage-mobile text-center form-block">
      <div
        className={cs(
          styles.sizeBlock,
          styles.sizeBlock1,
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          styles.centerpageDesktop,
          styles.centerpageMobile,
          globalStyles.textCenter,
          styles.formBlock,
          styles.pincodePopup
        )}
      >
        <div className={styles.cross} onClick={closeModal}>
          <i
            className={cs(
              iconStyles.icon,
              iconStyles.iconCrossNarrowBig,
              styles.icon,
              styles.iconCross
            )}
          ></i>
        </div>
        <div className={cs(styles.gcTnc, globalStyles.voffset5)}>
          {this.state.status === "" && pincodeForm}
          {this.state.status === "yes" && pincodeSuccess}
          {this.state.status === "no" && pincodeFail}
          {/* <div className="cerise-btn"><a onClick={props.acceptPopup}>OK</a></div> */}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PincodePopup);
