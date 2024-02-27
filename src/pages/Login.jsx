
import {useSelector, useDispatch} from "react-redux"
import axios from "axios"

function Login() {

  
  
  
  const dispatch = useDispatch()
  const {userId, username, password} = useSelector((state) => state.userSession)
  
  const handleLogin = async (e) => {
    e.preventDefault()
    console.log(userId, username, password)
    console.log(userId, username, password)
    const reqObj = {password, username}
    console.log(userId, username, password)
    const res = await axios.post('/login', reqObj)
    if (res.data.success) {
      dispatch({type: 'UPDATE_USER_SESSION', payload: {userId: res.data.userId, username: '', password: ''}})
    }
    console.log(userId, username, password)
    alert(res.data.message)
    console.log(res.data)
  }


    return (
      <>{!userId &&
        <form onSubmit={handleLogin}>
          <input
            type='text' 
            id='username'
            autoComplete='username'
            value={username} 
            placeholder='Username' 
            onChange={(e) => dispatch({type: 'UPDATE_USER_SESSION', payload: {username: e.target.value}})}
            />
          <input 
            type='password'
            id='password'
            value={password}
            placeholder='Password'
            onChange={(e) => dispatch({type: 'UPDATE_USER_SESSION', payload: {password: e.target.value}})}
            />
          <input 
            type='submit'
            />
        </form>
      }
      {userId && 
        <h3>Welcome, user # {userId}</h3>
      }</>
    )
  }
  
  export default Login