import React, { useContext } from "react";

import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import MainHeader from "./components/MainHeader/MainHeader";
import AuthContext from "./Store/auth-context";

function App() {
  const ctx = useContext(AuthContext);

  return (
    <React.Fragment>
      {/* <AuthContext.Provider */}
      {/* value={{ */}
      {/* isLoggedIn: isLoggedIn, */}
      {/* // #122 */}
      {/* onLogout: logoutHandler, */}
      {/* // #124 */}
      {/* }} */}
      {/* > */}
      {/* <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} /> */}
      {/* #122 */}
      {/* <MainHeader onLogout={logoutHandler} /> */}
      {/* #124 */}
      <MainHeader />
      <main>
        {!ctx.isLoggedIn && <Login />}
        {ctx.isLoggedIn && <Home />}
      </main>
      {/* </AuthContext.Provider> */}
    </React.Fragment>
  );
}

export default App;

//#124 We are passing functions via contexts as well to make them dynamic and also so that we don't have to pass logout prop

// One important note for Lecture 122. We are using this Context thing provided by React and created context using React.createContext({any default value, in our case it's an Object having isLoggedIn property set to false}).Then we wrapped everything inside return in App.js with AuthContext.Provider and thus any component wrapped with AuthContext.Provider and it's sub-components will have access to that Context created by React. Now to access that created Context , inside those sub-components we use AuthContext.Consumer and then a function inside return which has that context-value as arguement which in turn returns the component which is using that context's value.Now it will show error as when using default values in context we don't need Provider, only Consumer is needed.But our moto is not to work with default values while using Context so we passed another value attribute to Provider which marks the value of our context as dynamic and then everything works fine.BUT REMEMBER,don't provide anything static inside the value passed via Provider then also things will not work as expected, pass a dynamic value to that.

//AuthContext.Consumer can also be replaced by useContext hook provided by react.Just import {useContext} from 'react' and then const ctx = useContext(AuthContext) and then inside return( random code
// ctx.isLoggedIn).See code of 123

//#127 Only use react hooks in React function components or a custom react hook function, like in Login.js if you use useState inside Login function that returns any JSX code, that is any react component function, but if u use it inside emailReducer VSCODE will warn you and you will automatically get an error

//#127 Calling react hooks inside nested functions will also throw an error bcz you are not allowed to do that.You are only allowed to do that in top level code. For eg., if you call useState() inside the callback function of useEffect(() =>{useState()},[]) it will give error.Never call them inside callbacks.

//#127 Also remember not to call react hooks inside block statements like if else.
