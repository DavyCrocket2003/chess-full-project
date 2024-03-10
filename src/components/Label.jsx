import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import './Label.css'
import { useNavigate } from 'react-router-dom'

function Label({userId, squareRef}) {
    // squareRef is an attempt to dynamically style the label to match the board size

    const [userData, setUserData] = useState(null)
    const [width, setWidth] = useState('800px')
    const [height, setHeight] = useState('100px')
    const dispatch = useDispatch()
    const navigateTo = useNavigate()

    // function to get userData from server
    async function fetchUserData(id) {
        const res = await axios.get(`/users/${id}`)
        console.log(res.data)
        if (res.data.success) {
            console.log('userData', userData)
            setUserData(res.data.userData)
        } else {
            console.log('Error fetching user data')
        }   
    }
    // gets user data from db
    useEffect(() => {
        fetchUserData(userId)
    }, [])

    // function to send users to the profile page for the user in this label
    const clickProfile = () => {
        dispatch({type: "UPDATE_PROFILE", payload: userId})
        navigateTo('/profile')
    }

    // updates label size
    useEffect(() => {
        if (squareRef?.current) {
            setWidth(squareRef.current.offsetWidth * 8)
            setHeight(squareRef.current.offsetHeight)
        }
    }, [])  
    



  return userData ? (
    <div className='labelDiv' >
      
        <div className="labelItem" >
            <div className="profileImage">
                <img 
                  src={userData.photoURL} 
                  alt="Profile Image" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    position: 'relative',
                  }} 
                />
            </div>
        </div>
        <div className="labelItem" onClick={clickProfile}>{userData.username}</div>
        <div className="labelItem" >{userData.publicRating}</div>
      
    </div>
  ) : (<div className='labelDiv'>Loading...</div>)
}

export default Label
