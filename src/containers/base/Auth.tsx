import React, { useState } from "react";
import LoginService from "services/login";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import CookieService from "services/cookie";
import "./auth.css";
import { isAEDDisabled } from "typings/currency";

const FormPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  // const [passwordError, setpasswordError] = useState("");
  const [emailError, setemailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const handleValidation = (event: any) => {
    let formIsValid = true;

    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      formIsValid = false;
      setemailError("Email Not Valid");
      return false;
    } else {
      setemailError("");
      formIsValid = true;
    }

    // if (!password.match(/^[a-zA-Z]{4,22}$/)) {
    //   formIsValid = false;
    //   setpasswordError(
    //     "Only Letters and length must best min 4 Chracters and Max 22 Chracters"
    //   );
    //   return false;
    // } else {
    //   setpasswordError("");
    //   formIsValid = true;
    // }

    return formIsValid;
  };

  const loginSubmit = (e: any) => {
    e.preventDefault();
    if (handleValidation(e)) {
      LoginService.authLogin(dispatch, email, password)
        .then((response: any) => {
          if (response.showWebsite) {
            CookieService.setCookie("auth", "true", 365);
            const countryName = CookieService.getCookie("country");
            if (
              isAEDDisabled &&
              countryName.toLowerCase() === "united arab emirates"
            ) {
              history.push("/uaeshop");
            } else {
              history.push("/");
            }
          }
        })
        .catch(err => {
          if (err.response == 400) {
            setLoginError("Invalid Username or Password");
          } else {
            setLoginError("Server Error");
          }
        });
    }
  };

  return (
    <div className="App">
      <div className="login-block">
        <h1>Login</h1>
        <form id="loginform" onSubmit={loginSubmit}>
          <div>
            <label>Email address</label>
            <input
              type="email"
              id="EmailInput"
              name="EmailInput"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              onChange={event => setEmail(event.target.value)}
            />
            <small id="emailHelp" className="text-danger form-text">
              {emailError}
            </small>
          </div>
          <div className="margin-top">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              id="inputPassword1"
              placeholder="Password"
              onChange={event => setPassword(event.target.value)}
            />
            {/* <small id="passworderror" className="text-danger">
              {passwordError}
            </small> */}
          </div>
          <small id="emailHelp" className="text-danger">
            {loginError}
          </small>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
