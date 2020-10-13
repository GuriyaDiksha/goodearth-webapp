import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback
} from "react";
import Formsy from "formsy-react";
import FormInput from "../../../components/Formsy/FormInput";
import FormSelect from "../../../components/Formsy/FormSelect";
import CountryCode from "../../../components/Formsy/CountryCode";
import PinCode from "../../../components/Formsy/PinCode";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { useSelector, useDispatch } from "react-redux";
// import LoginService from "services/login";
import FormCheckbox from "components/Formsy/FormCheckbox";
import { AddressData, AddressFormData } from "../typings";
import { AddressContext } from "components/Address/AddressMain/context";
import { AppState } from "reducers/typings";
import { Country } from "components/Formsy/CountryCode/typings";
import AddressService from "services/address";
// import { updateCountryData } from "actions/address";

type Props = {
  addressData?: AddressData;
  currentCallBackComponent: string;
  saveAddress: () => void;
  openAddressList: () => void;
};

type CountryOptions = {
  value: string;
  label: string;
  code2: string;
  isd: string | undefined;
  states: StateOptions[];
};

type StateOptions = {
  value: string;
  label: string;
  id: number;
  nameAscii: string;
};

const AddressForm: React.FC<Props> = props => {
  const [isAddressChanged, setIsAddressChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCountryChanged, setIsCountryChanged] = useState(false);
  // const [defaultCountry] = useState("IN");
  const dispatch = useDispatch();
  const {
    closeAddressForm,
    mode,
    checkPinCode,
    // isAddressValid,
    setIsLoading,
    currentCallBackComponent
  } = useContext(AddressContext);
  const [isIndia, setIsIndia] = useState(false);
  const [countryOptions, setCountryOptions] = useState<CountryOptions[]>([]);
  const [stateOptions, setStateOptions] = useState<StateOptions[]>([]);
  const { addressData } = props;
  const { currency } = useSelector((state: AppState) => state);
  const { countryData, pinCodeData, addressList } = useSelector(
    (state: AppState) => state.address
  );
  const { email, isLoggedIn } = useSelector((state: AppState) => state.user);
  const { mobile } = useSelector((state: AppState) => state.device);

  const isAddressValid = useCallback(
    (postCode: string, state: string): boolean => {
      let isValid = false;
      // const validState = getStateFromPinCode(postCode);
      const validState = pinCodeData[postCode];
      if (validState && state.toLowerCase() == validState.toLowerCase()) {
        isValid = true;
      }
      return isValid;
    },
    [pinCodeData.length]
  );

  const AddressFormRef = useRef<Formsy>(null);
  // const StateRef = useRef<typeof FormSelect>(null);
  // state = {
  //     first_name: props.addressData ? props.addressData.first_name : "" || "",
  //     last_name: props.addressData ? props.addressData.last_name : "" || "",
  //     line1: props.addressData ? props.addressData.line1 : "" || "",
  //     line2: props.addressData ? props.addressData.line2 : "" || "",
  //     postcode: props.addressData ? props.addressData.postcode : "" || "",
  //     country_name: props.addressData ? props.addressData.country_name : (window.currency == "INR" ? "India" : window.currency == "GBP" ? "United Kingdom" : "") || "",
  //     phone: props.addressData ? props.addressData.phone_number ? valid.getPhnumber(props.addressData.phone_number) : "" : "",
  //     phone_number: props.addressData ? props.addressData.phone_number ? props.addressData.phone_number : "" : "",
  //     isdCode: props.addressData ? props.addressData.phone_number ? valid.getIsdfromnumber(props.addressData.phone_number) : "" : "",
  //     city: props.addressData ? props.addressData.city : "" || "",
  //     country: props.addressData ? props.addressData.country : "" || "",
  //     selectedState: props.addressData ? props.addressData.state : "" || "",
  //     defaultOption_con: props.addressData ? props.addressData.country : {} || {},
  //     update_profile: false,
  //     email: window.user.email ? window.user.email : window.guestUser ? window.guestUser.email : props.addressData ? props.addressData.Email_Id : "",
  //     defaultOption_sta: props.addressData ? props.addressData.state : {} || {},
  //     id: props.addressData ? props.addressData.id : "",
  //     is_default_for_shipping: props.addressData ? props.addressData.is_default_for_shipping : false,
  //     dispatch: props.dispatch || "",
  //     isLoading: true,
  //     country_options:[],
  //     state_options:[],
  //     currency: window.currency || "INR",
  //     postcodeError: "",
  //     pincodeData: {},
  //     pincodeList: [],
  //     isPostcodePristine: true,
  // }
  // changeCountryData = changeCountryData.bind(this);
  // resetForm = resetForm.bind(this);
  // handleInvalidSubmit = handleInvalidSubmit.bind(this);
  // addNewAddress = addNewAddress.bind(this);
  // checkStatus = checkStatus.bind(this);
  // setValue = setValue.bind(this);
  // handleKeypress = handleKeypress.bind(this);
  // setCode = setCode.bind(this);
  // handleAddressSubmitForform = handleAddressSubmitForform.bind(this);
  // handleAddressSubmitForformCheckout = handleAddressSubmitForformCheckout.bind(this);
  // handleBackClick = handleBackClick.bind(this);
  // setAddressData = setAddressData.bind(this);
  // getAddressData = getAddressData.bind(this);
  // changeState = changeState.bind(this);
  // const self = this;
  // addValidationRule('isValidPostcode', (values, value) => {
  //     return (self.handlePostcodeBlur(null, value));
  // });

  // const setAddressData = (props: AddressData) => {
  // setState({
  //     first_name: props.addressData ? props.addressData.first_name : "" || "",
  //     last_name: props.addressData ? props.addressData.last_name : "" || "",
  //     line1: props.addressData ? props.addressData.line1 : "" || "",
  //     line2: props.addressData ? props.addressData.line2 : "" || "",
  //     postcode: props.addressData ? props.addressData.postcode: "" || "",
  //     country_name: props.addressData ? props.addressData.country_name : "" || "",
  //     phone: props.addressData ? props.addressData.phone_number ? valid.getPhnumber(props.addressData.phone_number) : "" : "",
  //     phone_number: props.addressData ? props.addressData.phone_number ? props.addressData.phone_number : "" : "",
  //     isdCode: props.addressData ? props.addressData.phone_number ? valid.getIsdfromnumber(props.addressData.phone_number) : "" : "",
  //     city: props.addressData ? props.addressData.city : "" || "",
  //     country: props.addressData ? props.addressData.country : "" || "",
  //     selectedState: props.addressData ? props.addressData.state : "" || "",
  //     defaultOption_con: props.addressData ? props.addressData.country : {} || {},
  //     update_profile: false,
  //     email: window.user ? window.user.email : window.guestUser ? window.guestUser.email : props.addressData ? props.addressData.Email_Id : "",
  //     defaultOption_sta: props.addressData ? props.addressData.state : {} || {},
  //     id: props.addressData ? props.addressData.id : "",
  //     is_default_for_shipping: props.addressData ? props.addressData.is_default_for_shipping : false,
  //     dispatch: props.dispatch || ""
  // }, () => {
  //     if(props.editMode && (state.country == "IN" || state.country.code2 == "IN")) {
  //         const isValid = handlePostcodeBlur(null, state.postcode);
  //         if(!isValid) {
  //             setState({
  //                 update_profile: true
  //             })
  //         }
  //         else {
  //             setState({
  //                 update_profile: false
  //             })
  //         }
  //     }
  // })
  // }

  // componentWillReceiveProps(props) {
  //     if (props.editMode) {
  //         setState({
  //             addressData: props.addressData
  //         }, () => {
  //             if (window.user.email) {
  //                 setAddressData(props);
  //             }
  //         })
  //     }
  // }

  // componentDidMount() {
  //     getAddressData();
  // }

  // const getAddressData = () => {
  // let self = this;
  // if(self.state.country_options.length > 0) return false;
  // axios.get(Config.hostname + 'myapi/countries-state/')
  //     .then(res => {
  //         self.changeCountryData(res.data);
  //         if(state.country_name && !props.editMode) {
  //             self.handleDefaultCountry();
  //         }
  //     });
  // }

  const onCountrySelect = (
    event: React.ChangeEvent<HTMLSelectElement> | null,
    defaultCountry?: string
  ) => {
    if (countryOptions.length > 0) {
      const form = AddressFormRef.current;
      let selectedCountry = "";
      if (event) {
        selectedCountry = event.currentTarget.value;
        setIsAddressChanged(true);
        setIsCountryChanged(true);
        form &&
          form.updateInputsWithValue(
            {
              state: ""
            },
            false
          );

        // StateRef.current && StateRef.current.props.resetValue();
        // setPostCode("");
      } else if (defaultCountry) {
        selectedCountry = defaultCountry;
        // need to set defaultCountry explicitly
        if (form && selectedCountry) {
          form.updateInputsWithValue({
            country: selectedCountry
          });
        }
      }

      const { states, isd, value } = countryOptions.filter(
        country => country.value == selectedCountry
      )[0];

      if (form) {
        // reset state
        const { state } = form.getModel();
        if (state) {
          form.updateInputsWithValue({
            state: ""
          });
        }
        form.updateInputsWithValue({
          phoneCountryCode: isd
        });
      }
      setIsIndia(value == "India");
      setStateOptions(states);
    }

    // let state = [],
    //       country = {}, isdCode;
    //   state.country_options.map(child=> {
    //       if (child.value == event.target.value) {
    //           refs.isdref.state.value = child.isd;
    //           isdCode = child.isd;
    //           country = child;
    //           state = child.state;
    //       }
    //   });
    //   setState({
    //       state_options: state,
    //       defaultOption_con: country,
    //       defaultOption_sta: {},
    //       selectedState: "",
    //       postcode: "",
    //       isdCode
    //   });
    //   stateInput.props.setValue('');
    //   handleKeypress();
    //   checkStatus();
  };

  const setDefaultCountry = () => {
    switch (currency) {
      case "INR":
        onCountrySelect(null, "India");
        break;
      case "GBP":
        onCountrySelect(null, "United Kingdom");
        break;
    }
  };

  const changeCountryData = (countryData: Country[]) => {
    const countryOptions = countryData.map(country => {
      const states = country.regionSet.map(state => {
        return Object.assign({}, state, {
          value: state.nameAscii,
          label: state.nameAscii
        });
      });
      return Object.assign(
        {},
        {
          value: country.nameAscii,
          label: country.nameAscii,
          code2: country.code2,
          isd: country.isdCode,
          states: states
        }
      );
    });
    setCountryOptions(countryOptions);

    // let edit_country = {},
    //     edit_state = {},
    //     state_list = [],
    //     edit_isd = "";
    // let countrylist = data.map(con=> {
    //     if (props.editMode && con.code2 == state.country) {
    //         edit_country = {value: con.name_ascii, label: con.name_ascii, code2: con.code2};
    //         edit_isd = con.isd_code;
    //         state_list = con.region_set.map(data=> {
    //             return Object.assign({}, data, {value: data.name_ascii, label: data.name_ascii})
    //         })
    //     }
    //     let state = con.region_set.map(data=> {
    //         if (props.mode == 'edit' && data.name_ascii == props.data.state) {
    //             edit_state = {value: data.name_ascii, label: data.name_ascii};

    //         }
    //         return Object.assign({}, data, {value: data.name_ascii, label: data.name_ascii})
    //     })
    //     return Object.assign({}, {
    //         value: con.name_ascii,
    //         label: con.name_ascii,
    //         code2: con.code2,
    //         isd: con.isd_code
    //     }, {state: state})
    // });

    // if (props.editMode) {
    //     let country_name = countrylist.filter(country => country.code2 === state.country);

    //     setState({
    //         country_options: countrylist,
    //         state_options: state_list,
    //         defaultOption_con: edit_country,
    //         defaultOption_sta: edit_state,
    //         country_name: country_name[0].label,
    //         isdCode: state.addressData ? valid.getIsdfromnumber(state.addressData.phone_number) : state.isdCode,
    //         isLoading: false
    //     });
    // } else {

    //     refs.isdref.state.value ? "" : refs.isdref.state.value = countrylist[0].isd;
    //     setState({
    //         country_options: countrylist,
    //         state_options: countrylist[0].state,
    //         isLoading: false
    //     });
    // }
  };

  // const handleKeypress = (event: any) => {
  // if (event) {
  //     const name = event.target.name;
  //     setState({
  //         [name]: event.target.value
  //     }, () => {
  //         checkStatus();
  //     })
  // } else {
  //     checkStatus();
  // }
  // }

  // const checkStatus = () => {
  //     let check_status = false;
  //     if (props.editMode && refs.emailRef && refs.Fnameref && refs.Lnameref && refs.adder1ref && refs.adder2ref && refs.numberref && refs.pinref && refs.cityref && refs.stateref && refs.isdref) {
  //         if (refs.emailRef.state.value != window.user.email) {
  //             check_status = true;
  //         }
  //         if (refs.Fnameref.state.value != props.addressData.first_name) {
  //             check_status = true;
  //         }
  //         if (refs.Lnameref.state.value != props.addressData.last_name) {
  //             check_status = true;
  //         }
  //         if (refs.adder1ref.state.value != props.addressData.line1) {
  //             check_status = true;
  //         }
  //         if (refs.adder2ref.state.value != props.addressData.line2) {
  //             check_status = true;
  //         }
  //         if (refs.numberref.state.value != valid.getPhnumber(props.addressData.phone_number)) {
  //             check_status = true;
  //         }
  //         if (refs.pinref.state.value != props.addressData.postcode) {
  //             check_status = true;
  //         }
  //         if (refs.cityref.state.value != props.addressData.city) {
  //             check_status = true;
  //         }
  //         let countryName = state.defaultOption_con.label ? state.defaultOption_con.label : state.defaultOption_con;

  //         if(countryName != props.addressData.country_name){
  //             check_status = true;
  //         }
  //         if(refs.stateref.state.value != props.state){
  //              check_status = true;
  //         }
  //         if (refs.isdref.state.value != valid.getIsdfromnumber(props.addressData.phone_number)) {
  //             check_status = true;
  //         }
  //         setState({
  //             update_profile: check_status
  //         })
  //     } else {
  //         check_status = true;
  //         setState({
  //             update_profile: check_status
  //         })
  //     }
  // }

  const handleInvalidSubmit = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLDivElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 0);
  };

  const submitAddress = (model: any, resetForm: any, invalidateForm: any) => {
    setErrorMessage("");
    setIsLoading(true);
    // prepare data
    const { country } = model;
    const countryCode = countryOptions.filter(
      countryOption => countryOption.value == country
    )[0].code2;
    const formData: AddressFormData = {
      ...model,
      isDefaultForBilling: false,
      country: countryCode
    };
    if (mode == "new") {
      AddressService.addNewAddress(dispatch, formData)
        .then(() => {
          setIsLoading(false);
          closeAddressForm();
        })
        .catch(err => {
          const errData = err.response.data;
          const form = AddressFormRef.current;
          if (typeof errData == "string") {
            setErrorMessage(errData);
          } else if (typeof errData == "object") {
            form && form.updateInputsWithError(errData, true);
            handleInvalidSubmit();
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (mode == "edit" && addressData) {
      const { id } = addressData;
      AddressService.updateAddress(dispatch, formData, id)
        .then(() => {
          setIsAddressChanged(false);
          setIsLoading(false);
          closeAddressForm();
        })
        .catch(err => {
          const errData = err.response.data;
          const form = AddressFormRef.current;
          if (typeof errData == "string") {
            setErrorMessage(errData);
          } else if (typeof errData == "object") {
            form && form.updateInputsWithError(errData, true);
            handleInvalidSubmit();
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    //     setState({
    //         errorMessage: "",
    //         isLoading: true
    //     })
    //     if (!window.user.email || (props.currentCallBackComponent == "checkout" && !props.editMode)) {
    //         handleAddressSubmitForformCheckout(data, resetForm, invalidateForm);
    //     } else {
    //         handleAddressSubmitForform(data, resetForm, invalidateForm);
    //     }
  };

  // handleAddressSubmitForformCheckout(data, resetForm, invalidateForm) {
  //     let d = new FormData(),
  //         new_data = {};
  //     let products = valid.productForGa(props.items);
  //     const self = this;
  //     Object.keys(data).forEach(function (key) {
  //         if (data[key] !== undefined) {
  //             if (key == 'phone_number') {
  //                 d.append(key, self.state.isdCode + ' ' + data[key]);
  //             } else if (key == "country") {
  //                 let country = self.state.defaultOption_con.code2 ? self.state.defaultOption_con.code2 : self.state.defaultOption_con;
  //                 d.append(key, country)
  //             }
  //             else if (key != 'Isd') {
  //                 d.append(key, data[key]);
  //             }
  //         }
  //         else {
  //             data[key] = ''
  //             d.append(key, "");
  //         }
  //     });

  //     if (props.isLoggedIn) {
  //         if (props.editMode) {
  //             d.append('action_type', 'update');
  //             d.append('id', state.id);
  //         } else {
  //             d.append('action_type', 'create');
  //         }
  //         CustomerAddressApi.touchAddress(d, props.dispatch).then((res) => {
  //             if (res.data.Status) {
  //                 self.setState({errorMessage: null});
  //                 self.setState({
  //                     update_profile: false,
  //                     isLoading: false
  //                 })
  //                 let addressData = res.data.Address;
  //                 if (self.props.currentCallBackComponent == "account" || props.currentCallBackComponent == "bridal" || (props.addressType == "BILLING" && props.currentCallBackComponent == "checkout")) {
  //                     addressData = addressData.filter(data => !data.is_edit);
  //                 }
  // const checkStatus = () => {
  //     let check_status = false;
  //     if (props.editMode && refs.emailRef && refs.Fnameref && refs.Lnameref && refs.adder1ref && refs.adder2ref && refs.numberref && refs.pinref && refs.cityref && refs.stateref && refs.isdref) {
  //         if (refs.emailRef.state.value != window.user.email) {
  //             check_status = true;
  //         }
  //         if (refs.Fnameref.state.value != props.addressData.first_name) {
  //             check_status = true;
  //         }
  //         if (refs.Lnameref.state.value != props.addressData.last_name) {
  //             check_status = true;
  //         }
  //         if (refs.adder1ref.state.value != props.addressData.line1) {
  //             check_status = true;
  //         }
  //         if (refs.adder2ref.state.value != props.addressData.line2) {
  //             check_status = true;
  //         }
  //         if (refs.numberref.state.value != valid.getPhnumber(props.addressData.phone_number)) {
  //             check_status = true;
  //         }
  //         if (refs.pinref.state.value != props.addressData.postcode) {
  //             check_status = true;
  //         }
  //         if (refs.cityref.state.value != props.addressData.city) {
  //             check_status = true;
  //         }
  //         let countryName = state.defaultOption_con.label ? state.defaultOption_con.label : state.defaultOption_con;

  //         if(countryName != props.addressData.country_name){
  //             check_status = true;
  //         }
  //         if(refs.stateref.state.value != props.state){
  //              check_status = true;
  //         }
  //         if (refs.isdref.state.value != valid.getIsdfromnumber(props.addressData.phone_number)) {
  //             check_status = true;
  //         }
  //         setState({
  //             update_profile: check_status
  //         })
  //     } else {
  //         check_status = true;
  //         setState({
  //             update_profile: check_status
  //         })
  //     }
  // }

  // addNewAddress(data, resetForm, invalidateForm) {
  //     setState({
  //         errorMessage: "",
  //         isLoading: true
  //     })
  //     if (!window.user.email || (props.currentCallBackComponent == "checkout" && !props.editMode)) {
  //         handleAddressSubmitForformCheckout(data, resetForm, invalidateForm);
  //     } else {
  //         handleAddressSubmitForform(data, resetForm, invalidateForm);
  //     }
  // }

  // handleAddressSubmitForformCheckout(data, resetForm, invalidateForm) {
  //     let d = new FormData(),
  //         new_data = {};
  //     let products = valid.productForGa(props.items);
  //     const self = this;
  //     Object.keys(data).forEach(function (key) {
  //         if (data[key] !== undefined) {
  //             if (key == 'phone_number') {
  //                 d.append(key, self.state.isdCode + ' ' + data[key]);
  //             } else if (key == "country") {
  //                 let country = self.state.defaultOption_con.code2 ? self.state.defaultOption_con.code2 : self.state.defaultOption_con;
  //                 d.append(key, country)
  //             }
  //             else if (key != 'Isd') {
  //                 d.append(key, data[key]);
  //             }
  //         }
  //         else {
  //             data[key] = ''
  //             d.append(key, "");
  //         }
  //     });

  //     if (props.isLoggedIn) {
  //         if (props.editMode) {
  //             d.append('action_type', 'update');
  //             d.append('id', state.id);
  //         } else {
  //             d.append('action_type', 'create');
  //         }
  //         CustomerAddressApi.touchAddress(d, props.dispatch).then((res) => {
  //             if (res.data.Status) {
  //                 self.setState({errorMessage: null});
  //                 self.setState({
  //                     update_profile: false,
  //                     isLoading: false
  //                 })
  //                 let addressData = res.data.Address;
  //                 if (self.props.currentCallBackComponent == "account" || props.currentCallBackComponent == "bridal" || (props.addressType == "BILLING" && props.currentCallBackComponent == "checkout")) {
  //                     addressData = addressData.filter(data => !data.is_edit);
  //                 }
  // const checkStatus = () => {
  //     let check_status = false;
  //     if (props.editMode && refs.emailRef && refs.Fnameref && refs.Lnameref && refs.adder1ref && refs.adder2ref && refs.numberref && refs.pinref && refs.cityref && refs.stateref && refs.isdref) {
  //         if (refs.emailRef.state.value != window.user.email) {
  //             check_status = true;
  //         }
  //         if (refs.Fnameref.state.value != props.addressData.first_name) {
  //             check_status = true;
  //         }
  //         if (refs.Lnameref.state.value != props.addressData.last_name) {
  //             check_status = true;
  //         }
  //         if (refs.adder1ref.state.value != props.addressData.line1) {
  //             check_status = true;
  //         }
  //         if (refs.adder2ref.state.value != props.addressData.line2) {
  //             check_status = true;
  //         }
  //         if (refs.numberref.state.value != valid.getPhnumber(props.addressData.phone_number)) {
  //             check_status = true;
  //         }
  //         if (refs.pinref.state.value != props.addressData.postcode) {
  //             check_status = true;
  //         }
  //         if (refs.cityref.state.value != props.addressData.city) {
  //             check_status = true;
  //         }
  //         let countryName = state.defaultOption_con.label ? state.defaultOption_con.label : state.defaultOption_con;

  //         if(countryName != props.addressData.country_name){
  //             check_status = true;
  //         }
  //         if(refs.stateref.state.value != props.state){
  //              check_status = true;
  //         }
  //         if (refs.isdref.state.value != valid.getIsdfromnumber(props.addressData.phone_number)) {
  //             check_status = true;
  //         }
  //         setState({
  //             update_profile: check_status
  //         })
  //     } else {
  //         check_status = true;
  //         setState({
  //             update_profile: check_status
  //         })
  //     }
  // }

  // handleAddressSubmitForformCheckout(data, resetForm, invalidateForm) {
  //     let d = new FormData(),
  //         new_data = {};
  //     let products = valid.productForGa(props.items);
  //     const self = this;
  //     Object.keys(data).forEach(function (key) {
  //         if (data[key] !== undefined) {
  //             if (key == 'phone_number') {
  //                 d.append(key, self.state.isdCode + ' ' + data[key]);
  //             } else if (key == "country") {
  //                 let country = self.state.defaultOption_con.code2 ? self.state.defaultOption_con.code2 : self.state.defaultOption_con;
  //                 d.append(key, country)
  //             }
  //             else if (key != 'Isd') {
  //                 d.append(key, data[key]);
  //             }
  //         }
  //         else {
  //             data[key] = ''
  //             d.append(key, "");
  //         }
  //     });

  //     if (props.isLoggedIn) {
  //         if (props.editMode) {
  //             d.append('action_type', 'update');
  //             d.append('id', state.id);
  //         } else {
  //             d.append('action_type', 'create');
  //         }
  //         CustomerAddressApi.touchAddress(d, props.dispatch).then((res) => {
  //             if (res.data.Status) {
  //                 self.setState({errorMessage: null});
  //                 self.setState({
  //                     update_profile: false,
  //                     isLoading: false
  //                 })
  //                 let addressData = res.data.Address;
  //                 if (self.props.currentCallBackComponent == "account" || props.currentCallBackComponent == "bridal" || (props.addressType == "BILLING" && props.currentCallBackComponent == "checkout")) {
  //                     addressData = addressData.filter(data => !data.is_edit);
  //                 }
  //                 self.props.showEditForm({
  //                     showAddresses: true,
  //                     editMode: false,
  //                     newAddressMode: false,
  //                     addressesAvailable: true,
  //                     addressData: addressData
  //                 });
  //                 self.props.onSuccess();
  //             }
  //             else {
  //                 let msg = valid.errorMessages(res.data.error_message);
  //                 self.setState({errorMessage: msg, isLoading: false});
  //             }
  //         });
  //     } else {
  //         dataLayer.push({
  //             'event': 'checkout',
  //             'ecommerce': {
  //                 'currencyCode': window.currency,
  //                 'checkout': {
  //                     'actionField': {'step': 2},
  //                     'products': products
  //                 }
  //             }
  //         })
  //         new_data = Object.assign({}, data, {phone_number: self.state.isdCode + ' ' + data.phone_number})
  //         delete new_data['Isd'];
  //         let country = self.state.defaultOption_con.code2 ? self.state.defaultOption_con.code2 : self.state.defaultOption_con;
  //         new_data['country'] = country;
  //         self.setState({
  //             isLoading: false
  //         })
  //         self.props.onSuccess(new_data);
  //     }
  // }

  // handleAddressSubmitForform(data, resetForm, invalidateForm) {
  //     resetForm();
  //     let formData = new FormData(),
  //         msg = "";
  //     if (props.editMode) {
  //         if (!isAddressChanged) return true;
  //         formData.append("action_type", "update");
  //         formData.append("id", state.id);
  //     } else {
  //         formData.append("action_type", "create");
  //     }
  //     formData.append("city", refs.cityref.state.value)
  //     formData.append("first_name", refs.Fnameref.state.value)
  //     formData.append("last_name", refs.Lnameref.state.value)
  //     formData.append("line1", refs.adder1ref.state.value)
  //     formData.append("phone_number", state.isdCode + ' ' + refs.numberref.state.value)
  //     formData.append("line2", refs.adder2ref.state.value)
  //     formData.append("postcode", refs.pinref.state.value)
  //     let country = state.defaultOption_con.code2 ? state.defaultOption_con.code2 : state.defaultOption_con;
  //     formData.append("country", country)
  //     formData.append("state", state.defaultOption_sta.value || state.selectedState)
  //     formData.append("Email_Id", window.user.email)
  //     formData.append("is_default_for_shipping", state.is_default_for_shipping);
  //     const self = this;
  //     if (props.currentCallBackComponent !== "checkout") {
  //         axios.post(Config.hostname + 'myapi/saveaddressdetails/', formData
  //         ).then((response) => {
  //             msg = valid.errorMessages(response.data.error_message)
  //             if (response.data.Status) {
  //                 if (self.props.currentCallBackComponent !== "bridal-popup") {
  //                     self.setState({
  //                         update_profile: false,
  //                         isLoading: false
  //                     })
  //                     let addressData = response.data.Address;
  //                     if (self.props.currentCallBackComponent == "account" || props.currentCallBackComponent == "bridal" || (props.addressType == "BILLING" && props.currentCallBackComponent == "checkout")) {
  //                         addressData = addressData.filter(data => !data.is_edit);
  //                     }
  //                     self.props.showEditForm({
  //                         showAddresses: true,
  //                         editMode: false,
  //                         newAddressMode: false,
  //                         addressesAvailable: true,
  //                         addressData: addressData
  //                     });
  //                     if (props.toggleAddressForm) {
  //                         props.toggleAddressForm();
  //                     }
  //                 } else if (self.props.changeScreen) {
  //                     self.props.changeScreen();
  //                     self.setState({
  //                         update_profile: false,
  //                         isLoading: false
  //                     })
  //                 }
  //             } else {
  //                 self.setState({
  //                     errorMessage: msg,
  //                     isLoading: false
  //                 })
  //             }
  //         }).catch((err) => {
  //             msg = valid.errorMessages(err.data.error_message)
  //             setState({
  //                 errorMessage: msg,
  //                 isLoading: false
  //             })
  //         })
  //     } else if (props.isLoggedIn) {
  //         CustomerAddressApi.touchAddress(formData, props.dispatch).then((res) => {
  //             if (res.data.Status) {
  //                 setState({errorMessage: null});
  //                 setState({
  //                     update_profile: false,
  //                     isLoading: false
  //                 })
  //                 let addressData = res.data.Address;
  //                 if (self.props.currentCallBackComponent == "account" || props.currentCallBackComponent == "bridal" || (props.addressType == "BILLING" && props.currentCallBackComponent == "checkout")) {
  //                     addressData = addressData.filter(data => !data.is_edit);
  //                 }
  //                 props.showEditForm({
  //                     showAddresses: true,
  //                     editMode: false,
  //                     newAddressMode: false,
  //                     addressesAvailable: true,
  //                     addressData: addressData,
  //                 });
  //                 props.onSuccess();
  //             }
  //             else {
  //                 let msg = valid.errorMessages(res.data.error_message);
  //                 setState({errorMessage: msg, isLoading: false});
  //             }
  //         });
  //     } else {
  //         dataLayer.push({
  //             'event': 'checkout',
  //             'ecommerce': {
  //                 'currencyCode': window.currency,
  //                 'checkout': {
  //                     'actionField': {'step': 2},
  //                     'products': products
  //                 }
  //             }
  //         })
  //         new_data = Object.assign({}, data, {phone_number: self.state.isdCode + ' ' + data.phone_number})
  //         delete new_data['Isd'];
  //         let country = self.state.defaultOption_con.code2 ? self.state.defaultOption_con.code2 : self.state.defaultOption_con;
  //         new_data['country'] = country;
  //         setState({
  //             isLoading: false
  //         })
  //         props.onSuccess(new_data);
  //     }

  // }

  // resetForm() {
  //     setState({
  //         msg_num: false,
  //         msg_cit: false,
  //         msg_lnam: false,
  //         msg_fnam: false,
  //         msg_pin: false,
  //         msg_email: false,
  //         msg_add1: false,
  //         msg_add2: false,
  //         msg_state: false,
  //         msg_con: false,
  //         highlight_con: false,
  //         highlight_state: false,
  //         highlight_pin: false,
  //         highlight_num: false,
  //         highlight_cit: false,
  //         highlight_lnam: false,
  //         highlight_fnam: false,
  //         highlight_email: false,
  //         highlight_add1: false,
  //         highlight_add2: false
  //     })
  // }

  const changeState = (pinCode: string) => {
    const newState = pinCodeData[pinCode];
    const form = AddressFormRef.current;
    const { state } = form && form.getModel();
    if (state != newState) {
      form && form.updateInputsWithValue({ state: newState });
    }

    // let state = [],
    //     country = {};
    //     if(stateOptions.length > 0) {
    //         stateOptions.map(child=> {
    //             if (child.value == value) {
    //                 state = child
    //             }
    //         });
    //         setState({
    //             defaultOption_sta: state,
    //             selectedState: state.value
    //         })
    //     }
    //     else if(props.editMode) {
    //         setState({
    //             selectedState: value
    //         })
    //     }
    //     checkStatus();
  };

  // onStateSelect(event) {
  //     let state = [],
  //         country = {};
  //     stateOptions.map(child=> {
  //         if (child.value == event.target.value) {
  //             state = child
  //         }
  //     });

  //     setState({
  //         defaultOption_sta: state
  //     })

  //     handleKeypress();
  //     checkStatus();
  // }

  // handleDefaultCountry() {
  //     let state = [],
  //         country = {}, isdCode;
  //     state.country_options.map(child=> {
  //         if (child.value == state.country_name) {
  //             refs.isdref.state.value = child.isd;
  //             isdCode = child.isd;
  //             country = child;
  //             state = child.state;
  //         }
  //     });
  //     setState({
  //         state_options: state,
  //         defaultOption_con: country,
  //         defaultOption_sta: {},
  //         isdCode
  //     });
  //     stateInput.props.setValue('');
  //     handleKeypress();
  //     checkStatus();
  // }

  // setPostcodeError(error) {
  //     if(error) {
  //         setState({
  //             postcodeError: error,
  //             highlight_pin: true
  //         })
  //     }
  //     else {
  //         setState({
  //             postcodeError: "",
  //             highlight_pin: false
  //         })
  //     }
  // }

  // onBlurPostcode() {
  //     return state.postcodeError === "";
  // }

  // handlePostcodeChange(newValue) {
  //     setState({
  //         postcode: newValue,
  //         isPostcodePristine: false
  //     }, () => {
  //         checkStatus();
  //     })
  // }

  const handlePostcodeBlur = (event: React.MouseEvent<HTMLInputElement>) => {
    const pinCode = event.currentTarget.value;
    checkPinCode(pinCode) && changeState(pinCode);

    //     let postcodeValue = event ? event.target.value : value;
    //     let isValid = true;
    //     let postcodeError = "";
    //         if (postcodeValue.length == 0) {
    //             isValid = false;
    //         } else {
    //             if(!(postcodeValue in props.pincodeData)) {
    //                 isValid = false;
    //             }
    //             else {
    //                 if(!state.isPostcodePristine) {
    //                     if(event) {
    //                         changeState(props.pincodeData[event.target.value]);
    //                     }
    //                     else if(value) {
    //                         changeState(props.pincodeData[value]);
    //                     }
    //                 }
    //                 else {
    //                     if(event) {
    //                         if(state.selectedState != props.pincodeData[event.target.value]) {
    //                             isValid = false;
    //                         }
    //                     }
    //                     else {
    //                         if(state.selectedState != props.pincodeData[value]) {
    //                             isValid = false;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     if(!isValid) {
    //         postcodeError = "Please enter valid Pin/Zip code";
    //     }
    //     setPostcodeError(postcodeError);
    //     return isValid;
    // }

    // const closeAddressForm = () => {
    //     props.showEditForm({
    //         showAddresses: true,
    //         editMode: false,
    //         newAddressMode: false,
    //         addressesAvailable: false
    //     });
    //     if (props.setAddressModeProfile) {
    //         props.setAddressModeProfile({
    //             showAddresses: true,
    //             editMode: false,
    //             newAddressMode: false,
    //             addressesAvailable: false
    //         })
    //     }
  };

  // setValue(value) {
  //     if (state.is_default_for_shipping !== value) {
  //         setState({
  //             update_profile: true,
  //             is_default_for_shipping: value
  //         }, () => {
  //             checkStatus()
  //         })
  //     } else {
  //         setState({
  //             update_profile: false,
  //             is_default_for_shipping: value
  //         }, () => {
  //             checkStatus()
  //         })
  //     }
  // }

  // setCode(value) {
  //     setState({
  //         isdCode: value
  //     }, () => {
  //         checkStatus();
  //     })
  // }

  // const handleBackClick = () => {
  //     // props.toggleAddressForm();
  //     props.showEditForm({
  //         showAddresses: true,
  //         editMode: false,
  //         newAddressMode: false,
  //         addressesAvailable: false
  //     });
  // }

  const isExistyError = "This field is required";
  const isAlphanumericError = "Only alphabets and numbers are allowed";
  const isAlphaError = "Only alphabets are allowed";
  const isEmailError = "Please enter the correct email";

  useEffect(() => {
    const firstField = document.getElementById("first-field") as HTMLDivElement;
    firstField && firstField.focus();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    changeCountryData(countryData);
  }, [countryData]);

  useEffect(() => {
    mode == "new" && countryOptions.length > 0 && setDefaultCountry();
  }, [countryOptions]);

  useEffect(() => {
    if (mode == "edit" && addressData) {
      // extract formData from address
      const {
        firstName,
        lastName,
        city,
        postCode,
        countryName,
        phoneCountryCode,
        phoneNumber,
        isDefaultForShipping,
        line1,
        line2,
        state
      } = addressData;
      // update stateOptions based on country
      onCountrySelect(null, countryName);

      const form = AddressFormRef.current;
      form &&
        form.updateInputsWithValue(
          {
            firstName,
            lastName,
            city,
            postCode,
            country: countryName,
            phoneCountryCode,
            phoneNumber,
            isDefaultForShipping,
            line1,
            line2,
            state
          },
          true
        );
      // setPostCode(postCode);
    }
  }, [addressData, countryOptions]);
  const bridalUser = { userId: 0 };
  return (
    <div
      className={cs(
        styles.loginForm,
        {
          [bootstrapStyles.col12]:
            currentCallBackComponent == "checkout-shipping" ||
            currentCallBackComponent == "checkout-billing"
        },
        {
          [bootstrapStyles.colMd7]:
            currentCallBackComponent == "checkout-shipping" ||
            currentCallBackComponent == "checkout-billing"
        }
      )}
    >
      {currentCallBackComponent == "account" && (
        <div className="back-btn-div">
          <div
            className={cs(
              styles.backBtnTop,
              styles.backBtnAddress,
              styles.formSubheading
            )}
            onClick={closeAddressForm}
          >
            &lt; back
          </div>
        </div>
      )}
      <Formsy
        ref={AddressFormRef}
        onValidSubmit={submitAddress}
        onInvalidSubmit={handleInvalidSubmit}
      >
        <div className={styles.categorylabel}>
          <div>
            <FormInput
              name="emailId"
              required
              className={cs({
                [styles.disabledInput]:
                  (addressData && addressData.emailId) || email
              })}
              label="Email Address"
              placeholder="Email Address"
              // onChange={handleKeypress}
              value={(addressData && addressData.emailId) || email}
              disable={!!((addressData && addressData.emailId) || email)}
              validations={{
                isExisty: true,
                isEmail: true
              }}
              validationErrors={{
                isExisty: isExistyError,
                isEmail: isEmailError
              }}
            />
          </div>
          <div>
            <FormInput
              id="first-field"
              required
              name="firstName"
              label="First Name"
              placeholder="First Name"
              // onChange={handleKeypress}
              // value={state.first_name}
              // value={(addressData && addressData.firstName)}
              handleChange={() => setIsAddressChanged(true)}
              validations={{
                isExisty: true,
                isWords: true,
                maxLength: 15
              }}
              validationErrors={{
                isExisty: isExistyError,
                isWords: isAlphaError,
                maxLength: "You can not type in more than 15 characters"
              }}
            />
          </div>
          <div>
            <FormInput
              required
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              // onChange={handleKeypress}
              // value={state.last_name}
              // value={(addressData && addressData.lastName)}
              handleChange={() => setIsAddressChanged(true)}
              validations={{
                isExisty: true,
                isWords: true,
                maxLength: 15
              }}
              validationErrors={{
                isExisty: isExistyError,
                isWords: isAlphaError,
                maxLength: "You can not type in more than 15 characters"
              }}
            />
          </div>
          {// state.defaultOption_con.code2 == "IN" || state.defaultOption_con == "IN"
          isIndia ? (
            <div>
              <PinCode
                // setPostcode={checkStatus}
                // error={state.postcodeError}
                // setPostcodeError={setPostcodeError.bind(this)}
                // disable={!!props.currentCallBackComponent}
                // onChange={handlePostcodeChange.bind(this)}
                // pincodeList={props.pincodeList}
                // pinCodeList={["110089"]}
                id="pincode"
                // editMode={props.editMode}
                // data={props.pincodeData}
                blur={handlePostcodeBlur}
                // value={state.postcode}
                value={
                  addressData && !isCountryChanged ? addressData.postCode : ""
                }
                handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setIsAddressChanged(true);
                  // setPostCode(event.currentTarget.value);
                }}
                label="Pin/Zip Code"
                validations={{
                  isExisty: true,
                  isValidPostcode: (values, value) => {
                    const { postCode, state } = values;
                    return isAddressValid(postCode, state);

                    // return handlePostcodeBlur(null, value);
                  }
                }}
                validationErrors={{
                  isExisty: "isExistyError",
                  isValidPostcode: "Please enter valid Pin/Zip code"
                }}
                changeState={changeState}
                placeholder="Pin/Zip Code"
                name="postCode"
                // code={state.postcode}
                // border={state.highlight_pin}
                required
              />
            </div>
          ) : (
            <div>
              <FormInput
                required
                name="postCode"
                label="Pin/Zip Code"
                placeholder="Pin/Zip Code"
                // onChange={handleKeypress}
                // value={state.postcode}
                value={
                  addressData && !isCountryChanged ? addressData.postCode : ""
                }
                handleChange={event => {
                  setIsAddressChanged(true);
                  // setPostCode(event.currentTarget.value);
                }}
                validations={{
                  isExisty: true,
                  matchRegexp: /^[a-z\d\-_\s]+$/i
                }}
                validationErrors={{
                  isExisty: isExistyError,
                  matchRegexp: isAlphanumericError
                }}
              />
            </div>
          )}
          <div>
            <div className="select-group text-left">
              <FormSelect
                required
                label="Country"
                options={countryOptions}
                // options={[
                //   {
                //     label: "India",
                //     value: "IN"
                //   }
                // ]}
                // value={props.country_name}
                handleChange={onCountrySelect}
                placeholder="Select Country"
                name="country"
                validations={{
                  isExisty: true
                }}
                validationErrors={{
                  isExisty: isExistyError,
                  isEmptyString: isExistyError
                }}
              />
              <span className="arrow"></span>
            </div>
          </div>
          <div>
            <div className="select-group text-left">
              <FormSelect
                required
                name="state"
                label="State"
                placeholder="Select State"
                // ref={StateRef}
                // onChange={onStateSelect.bind(this)}
                // disable={ (state.defaultOption_con.code2 == "IN" || state.defaultOption_con == "IN")? true : false}
                disable={isIndia}
                options={stateOptions}
                // options={[
                //   {
                //     label: "Haryana",
                //     value: "HR"
                //   }
                // ]}
                // innerRef={(c) => { stateInput = c; }}
                // value={state.selectedState}
                value=""
                handleChange={() => setIsAddressChanged(true)}
                validations={{
                  isExisty: true
                }}
                validationErrors={{
                  isExisty: isExistyError,
                  isEmptyString: isExistyError
                }}
              />
              {/* <span className={`arrow ${(state.defaultOption_con.code2 == "IN" || state.defaultOption_con == "IN")? "disabled-arrow" : ""}`}></span> */}
            </div>
          </div>
          <div>
            <FormInput
              required
              name="line1"
              label="Address Line 1"
              placeholder="Address Line 1"
              // onChange={handleKeypress}
              // value={state.line1}
              handleChange={() => setIsAddressChanged(true)}
              validations={{
                maxLength: 70,
                isExisty: true
              }}
              validationErrors={{
                isExisty: isExistyError,
                // isEmptyString: isExistyError,
                maxLength: "You can not type in more than 70 characters"
              }}
            />
          </div>
          <div>
            <FormInput
              name="line2"
              label="Address Line 2"
              placeholder="Address Line 2"
              // onChange={handleKeypress}
              handleChange={() => setIsAddressChanged(true)}
              validations={{
                maxLength: 35
              }}
              validationErrors={{
                maxLength: "You can not type in more than 35 characters"
              }}
              // value={state.line2}
            />
          </div>
          <div>
            <FormInput
              required
              name="city"
              label="City"
              placeholder="City"
              // onChange={handleKeypress}
              // value={state.city}
              handleChange={() => setIsAddressChanged(true)}
              validations={{
                isExisty: true,
                isWords: true
              }}
              validationErrors={{
                isExisty: isExistyError,
                isWords: isAlphaError
              }}
            />
          </div>
          <div className={styles.countryCode}>
            <CountryCode
              // setCode={setCode}
              // codemsg={state.codemsg}
              id="isdcode"
              value=""
              // fetchCountryData={fetchCountryData}
              // countryData={countryData}
              disable={!!props.currentCallBackComponent}
              placeholder="Code"
              name="phoneCountryCode"
              // code={state.isdCode}
              // highlightCode={state.highlightCode}
            />

            <FormInput
              required
              name="phoneNumber"
              label="Contact Number"
              placeholder="Contact Number"
              // onChange={handleKeypress}
              // value={state.phone}
              handleChange={() => setIsAddressChanged(true)}
              validations={{
                isExisty: true,
                matchRegexp: /^[0-9\-/]+$/
              }}
              validationErrors={{
                isExisty: isExistyError,
                matchRegexp: "Please enter valid a phone number"
              }}
            />
          </div>
          {/* {(window.user.email && props.currentCallBackComponent !== "bridal-popup") && */}
          {true && (
            <div className={styles.addressFormCheckbox}>
              <FormCheckbox
                name="isDefaultForShipping"
                label={["MAKE THIS MY DEFAULT ADDRESS"]}
                // value={state.is_default_for_shipping}
                value={false}
                id="isShippingAddress"
                disable={false}
                handleChange={() => setIsAddressChanged(true)}
                // checked={state.is_default_for_shipping}
                // setValue={setValue}
              />
            </div>
          )}
          <div>
            <div className="row">
              <div className="col-xs-12">
                {mode == "edit" ? (
                  <input
                    formNoValidate={true}
                    type="submit"
                    value={isAddressChanged ? "Update Address" : "Updated"}
                    className={cs(globalStyles.ceriseBtn, {
                      [globalStyles.disabledBtn]: !isAddressChanged
                    })}
                    disabled={!isAddressChanged}
                  />
                ) : (
                  <input
                    formNoValidate={true}
                    type="submit"
                    value="Save Address"
                    className={cs(globalStyles.ceriseBtn, {
                      [globalStyles.disabledBtn]: !isAddressChanged
                    })}
                    disabled={!isAddressChanged}
                  />
                )}
              </div>
            </div>
            {errorMessage ? (
              <p className={globalStyles.errorMsg}>{errorMessage}</p>
            ) : (
              <p className={globalStyles.errorMsg}></p>
            )}
          </div>
        </div>
      </Formsy>
      {(currentCallBackComponent !== "checkout-billing" &&
        currentCallBackComponent !== "checkout-shipping") ||
        (mobile && (
          <div className={cs(styles.backBtnCenter, styles.backBtnProfile)}>
            <span
              className={cs(
                styles.backBtn,
                globalStyles.ointer,
                styles.formSubheading
              )}
              onClick={closeAddressForm}
            >
              &lt; back
            </span>
          </div>
        ))}
      {isLoggedIn &&
        !mobile &&
        (currentCallBackComponent == "checkout-billing" ||
          currentCallBackComponent == "checkout-shipping") && (
          <div
            className={cs(
              globalStyles.textRight,
              styles.formSubheading,
              styles.backAddressForm
            )}
          >
            <div className={globalStyles.pointer} onClick={closeAddressForm}>
              {addressList
                ? addressList.filter(data => !data.isBridal && !data.isTulsi)
                    .length > 0 || bridalUser.userId
                  ? "< BACK TO SAVED ADDRESSES"
                  : ""
                : "< BACK TO SAVED ADDRESSES"}
              {/* Back to Saved Addresses */}
            </div>
          </div>
        )}
    </div>
  );
};

export default AddressForm;
