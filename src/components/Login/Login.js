import React, { useState, useEffect, useReducer, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../Store/auth-context";

//const emailReducer = (lastStateSnapshot, actionThatWasDispatched) => {
//  We should return a new state here, that could be an object too
//};

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  //As above here we are not passing any value since its verifying the entered value, thus state.value will give us that value and it's ensured by react that it is the latest state snapshot
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const { isValid: emailIsValid } = emailState; //118
  const { isValid: passwordIsValid } = passwordState; //118

  const authCtx = useContext(AuthContext);

  //#114 Important concepts regarding cleanups
  useEffect(() => {
    console.log("Checking form validity!!!");
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 1000);

    return () => {
      console.log("CLEANUP!!!");
      clearTimeout(identifier);
    };

    //When the page is loaded for the first time, this useEffect runs immediately by default behaviour and then whenever any keystroke occurs, states are changed and components are re-rendered then this cleanup function runs before every state call, we swa it in output "CLEANUP!!!" is logged first and then "Checking form validity" on every case except for the first time render of the page. We'll use this to cleanup the timers so that we have only one ongoing timer
  }, [emailIsValid, passwordIsValid]);

  //#118 On why we brought back this useEffect hook. We know that React schedules state updates and thus whenever any state update depends on another states updates, it is not a good practice.But again in 118 we brought back this useEffect hook and inside it we are updating the form depending on emailState and passwordState, though it is not good but here we will get the latest email and password states because useEffect always triggers whenever either of the provided dependencies changes

  //#118 But again we have a problem, as we are using emailState and passwordState as dependencies and since useEffect triggers on every change in dependency and setFormIsValid depends on only the validity part, then even if the email and password are valid but still if extra characters are added then inspite of being valid the useEffect again triggers which is not we want so we will use object destructuring to extract the validity part from emailState and paswordState and use them insted of them as a whole

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
    //This object(can be anything like a string, a number etc) that we passed will now get accessed via that action that we  pass in  emailReducer.This generally has a type attribute which is unique for now to access this particular dispatch and since this emailChangeHandler sets a value on that email, it makes sense to pass a payload property on the object(here val, now action.val inside emailReducer will give this value)

    // setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });

    // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    //setEmailIsValid(emailState.isValid);
    dispatchEmail({ type: "INPUT_BLUR" });
    //Here we are simply focusing on whether the input gets blurred or not,i.e, whether it lost focus or not and no value is passed and if u think that now action.val in this case is undefined then it is not bcz we are accessing that condition when action.type was USER_INPUT, but here it is INPUT_BLUR
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
