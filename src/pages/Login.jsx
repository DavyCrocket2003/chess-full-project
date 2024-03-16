
import {useSelector, useDispatch} from "react-redux"
import axios from "axios"
import handlerFunctions from "../controllers/clientController"
import { useState } from "react"

function Login() {

  
  
  
  const dispatch = useDispatch()
  const userSession = useSelector((state) => state.userSession)
  const [passwordAttempt, setPasswordAttempt] = useState('')
  const [usernameAttempt, setUsernameAttempt] = useState('')
  const [registerMode, setRegisterMode] = useState(false)
  const [registerData, setRegisterData] = useState({username: '', password1: '', password2: '', email: ''})
  

  const handleRegister = async (e) => {
    e.preventDefault()
    console.log('handleRegister called', registerData)
    const res = await axios.post('/register', registerData)
    if (res.data.success) {
      alert('Registration successful. Please login to continue')
      setRegisterMode(false)
    } else {
      alert(res.data.message)
    }
  }


  return (
    <>
      <div className="styledContainer loginBox">
        {userSession.userId ? (
          <div style={{textAlign: 'center'}}>
            <h3>Welcome, {userSession.username}</h3>
            <button onClick={(e) => handlerFunctions.handleLogout(e, dispatch)}>Logout</button>
          </div>
        ) : (
          <div style={{textAlign: 'center'}}>
            {!registerMode ? (
              <form onSubmit={(e) => handlerFunctions.handleLogin(e, dispatch, usernameAttempt, passwordAttempt)}>
                <input className="formElement"
                  type='text'
                  id='username'
                  autoComplete='username'
                  value={usernameAttempt}
                  placeholder='Username'
                  onChange={(e) => setUsernameAttempt(e.target.value)}
                />
                <input className="formElement"
                  type='password'
                  id='password'
                  value={passwordAttempt}
                  placeholder='Password'
                  onChange={(e) => setPasswordAttempt(e.target.value)}
                /><br/>
                <input className="formElement" style={{marginRight: '43px'}}
                  type='submit'
                  value='Login'
                />
                <input className="formElement" type="button" value="Register" onClick={() => setRegisterMode(true)} />
              </form>
            ) : (
              <form onSubmit={(e) => handleRegister(e)}>
                <input
                  type='text'
                  autoComplete='username'
                  value={registerData.username}
                  placeholder='Username'
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                />
                <input
                  type='password'
                  value={registerData.password1}
                  placeholder='Password'
                  onChange={(e) => setRegisterData({ ...registerData, password1: e.target.value })}
                />
                <input
                  type='password'
                  value={registerData.password2}
                  placeholder='Confirm Password'
                  onChange={(e) => setRegisterData({ ...registerData, password2: e.target.value })}
                />
                <input
                  type='email'
                  value={registerData.email}
                  placeholder='Email'
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
                <input
                  type='submit'
                  value='Register'
                />
                <input type="button" value="Cancel" onClick={() => setRegisterMode(false)} />
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
  
  }
  
  export default Login