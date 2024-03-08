import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import './Label.css'

function Label({userId, squareRef}) {

    const [userData, setUserData] = useState(null)
    const [width, setWidth] = useState('800px')
    const [height, setHeight] = useState('100px')


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


    // updates label size
    useEffect(() => {
        if (squareRef?.current) {
            setWidth(squareRef.current.offsetWidth * 8)
            setHeight(squareRef.current.offsetHeight)
        }
    }, [])  
    



  return userData ? (
    <div className='labelDiv' style={{ width: width, height: height }} >
      
        <div className="labelItem" style={{ flex: '1'}}>
            <div className="profileImage" style={{ width: '15px', height: '15px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={userData.photoURL} 
                  alt="Profile Image" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }} 
                />
            </div>
        </div>
        <div className="labelItem" style={{ flex: '6'}}>{userData.username}</div>
        <div className="labelItem" style={{ flex: '1'}}>{userData.publicRating}</div>
      
    </div>
  ) : (<p>Loading...</p>)
}

export default Label
