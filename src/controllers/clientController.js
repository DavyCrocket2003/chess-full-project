import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateUserSession } from "./sessionActions";



const handlerFunctions = {
    handleLogin: async (e, dispatch, usernameInput, passwordInput) => {
        e.preventDefault()
        const reqObj = {usernameInput, passwordInput}
        const res = await axios.post('/login', reqObj)
        if (res.data.success) {
        dispatch(updateUserSession({userId: res.data.userId, username: usernameInput, usernameInput: '', passwordInput: '', status: 'loggedIn'}))
        }
    },
    handleLogout: async (_, dispatch) => {
        const res = await axios.get('/logout')
        if (res.data.success) {
            dispatch(updateUserSession({userId: null, status: 'loggedOut'}))
        }
    }
}


export default handlerFunctions