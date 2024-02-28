
import {useSelector, useDispatch} from "react-redux"
import axios from "axios"
import handlerFunctions from "../clientController"

function Login() {

  
  
  
  const dispatch = useDispatch()
  const userSession = useSelector((state) => state.userSession)
  


    return (
      <>{!userSession.userId &&
        <form onSubmit={(e) => handlerFunctions.handleLogin(e, dispatch, userSession.usernameInput, userSession.passwordInput)}>
          <input
            type='text' 
            id='username'
            autoComplete='username'
            value={userSession.usernameInput} 
            placeholder='Username' 
            onChange={(e) => dispatch({type: 'UPDATE_USER_SESSION', payload: {usernameInput: e.target.value}})}
            />
          <input 
            type='password'
            id='password'
            value={userSession.passwordInput}
            placeholder='Password'
            onChange={(e) => dispatch({type: 'UPDATE_USER_SESSION', payload: {passwordInput: e.target.value}})}
            />
          <input 
            type='submit'
            value='Login'
            />
        </form>
      }
      {userSession.userId &&
      <>
        <h3>Welcome, {userSession.username}</h3>
        <button onClick={(e) => handlerFunctions.handleLogout(e,dispatch)}>Logout</button>
      </>
      }</>
    )
  }
  
  export default Login