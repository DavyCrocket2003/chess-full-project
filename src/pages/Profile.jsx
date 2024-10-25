import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import handlerFunctions from "../controllers/clientController"
import { useParams, useNavigate } from 'react-router-dom'
import CompletedGames from '../components/CompletedGames'



function Profile() {

  const userId = useSelector(state => state.userSession.userId)
  const username = useSelector(state => state.userSession.username)
  const status = useSelector(state => state.userSession.status)
  const profileId = useSelector(state => state.profileId)
  const navigateTo = useNavigate()

  const [editMode, setEditMode] = useState(false)
  const [userData, setUserData] = useState(null)
  const [verifyMode, setVerifyMode] = useState(false)
  const [usernameAttempt, setUsernameAttempt] = useState('')
  const [passwordAttempt, setPasswordAttempt] = useState('')
  const [friendshipData, setFriendshipData] = useState(null)
  const currentYear = new Date().getFullYear();
  const getFriendship = async () => {
    let response = null
    if (userId && profileId && userId!==profileId) {
      response = await axios.get(`/friendship`, {
        params: {
          user1Id: userId,
          user2Id: profileId
        }
      })
    }
    setFriendshipData(response?response.data.friendship:null)
  }



  const getUserData = async (id) => {
    try {
      const {data} = await axios.get(`/users/${id}`); // Fetch data asynchronously
      console.log(data)
      setUserData(data.userData); // Update state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // useEffect that populates user data
  useEffect(() => {
    // Use useEffect to fetch data when the component mounts
    getUserData(profileId ? profileId : userId); // Call the async function
    // Fetch viewer<-->profile friendship status
    getFriendship()
    // Clean off the state
    return () => {
      dispatch({type: "UPDATE_PROFILE", payload: null})
    }
  }, [profileId])

  async function verifyPassword() {
    let res = await axios.post('/verify', {userId, password: passwordAttempt, username: usernameAttempt})
    if (res.data.success) {
      setEditMode(true)
      setVerifyMode(false)
      setUsernameAttempt('')
      setPasswordAttempt('')
    } else {
      alert('Authentication failed')
      setVerifyMode(false)
    }
  }
  function saveChanges() {
    let data = {...userData}
    axios.put('users', {userId, data})
    setEditMode(false)
  }

  const dispatch = useDispatch()
  async function deleteAccount() {
    let response = prompt("Are you sure you want to delete your account? Y or N")
    if (response[0].toUpperCase() === 'Y') {
      const res = await axios.delete(`/users/${userId}`)

      if (res.data.success) {
        alert('Account deleted')
        handlerFunctions.handleLogout('', dispatch)
      } else {
        alert('Error deleting account')
      }
    }
  }
  // Need to write functions for:
  // acceptRequest
  const handleRequest = (status) => {
    axios.put('/friendship', {user1Id: userId, user2Id: profileId, status})
      .then((res) => {
        if (res.data.success) {
          alert(`Friendship ${status}`)
          setFriendshipData({...friendshipData, status, createdAt: Date.now()})
        } else {
          // fail case
        }
      })
  }
  // sendMessage
  const sendMessage = () => {
    dispatch({type: "UPDATE_MESSAGE_TARGET", payload: profileId})
    navigateTo('/messages')
  }

  // sendRequest
  const sendRequest = () => {
    axios.post('/friendship', {user1Id: userId, user2Id: profileId})
    .then((res) => {
      if (res.data.success) {
        alert('Friendship request sent')
        setFriendshipData({status: 'pending', requestedBy: userId})
      }
    })
  }

  const dataListener = (property, value) => {
      setUserData({...userData, [property]: value})
    }

  return userData ? (
    <>
      <div className='styledContainer' id='profileBox'>
        <table className='profileTable'>
          <tbody>
            <tr>
              <td>
                <div style={{ width: '200px', height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={userData.photoURL} 
                    alt="Description of the image" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      position: 'relative',
                      top: 0,
                      left: 0
                    }} 
                  />
                </div>

              </td>
            </tr>
                  {editMode && <tr><td><input type="url" value={userData.photoURL} onChange={(e) => dataListener('photoURL', e.target.value)}></input></td></tr>}
            <tr>
              <td colSpan={2}>{!editMode ? <h4>{userData.bio}</h4> : <input type="text" value={userData.bio} onChange={(e) => dataListener('bio', e.target.value)} />}</td>
            </tr>
            {/* <tr>Stuff: {JSON.stringify(friendshipData)}</tr> */}
            {(() => {
              switch (friendshipData?.status) {
                case "pending":
                  return friendshipData.requestedBy===userId ? (
                  <tr><td>Friend Request Sent</td></tr>
                  ) : (
                    <tr><td><button onClick={() => handleRequest('accepted')}>Accept Friend Request</button></td><td><button onClick={() => handleRequest('rejected')}>Delete</button></td></tr>
                  )
                case "accepted":
                  return <tr><td>Friends since {friendshipData.createdAt}</td><td><button onClick={sendMessage}>Message</button></td></tr>
                case "rejected":
                  return null
                default:
                  return (profileId && <tr><td><button onClick={sendRequest}>Add Friend</button></td></tr>)
              }
            })()}
            {!profileId && <tr>
              <td>Email:</td>
              <td>{!editMode ? userData.email : <input type="email" value={userData.email} onChange={(e) => dataListener('email', e.target.value)} />}</td>
            </tr>}
            {!profileId && <tr>
              <td>Password:</td>
              <td>{!editMode ? '*'.repeat(userData.password.length) : <input type="password" value={userData.password} onChange={(e) => dataListener('password', e.target.value)} />}</td>
            </tr>}
            <tr>
              <td>Location:</td>
              <td>{!editMode ? userData.country : <input type="text" value={userData.country} onChange={(e) => dataListener('country', e.target.value)} />}</td>
            </tr>
            <tr>
              <td>Rating:</td>
              <td>{userData.publicRating}</td>
            </tr>
            <tr>
              <td>Rough Age:</td>
              <td>
                {currentYear - userData.birthYear} years
                {editMode && (
                  <>
                    <td>Birth year:</td>
                    <td>
                      <input 
                        type="number" 
                        min={1900} 
                        max={currentYear} 
                        value={userData.birthYear} 
                        onChange={(e) => dataListener('birthYear', e.target.value)} 
                      />
                    </td>
                  </>
                )}
              </td>
            </tr>
          </tbody>
          <tfoot>
            {!profileId && <tr>
              {!editMode ? <> {verifyMode && (
                <div style={{maxWidth: '175px'}}>
                  <p>Please verify your credentials to make changes</p>
                  <input type="text" value={usernameAttempt} onChange={(e) => setUsernameAttempt(e.target.value)} />
                  <input type="password" value={passwordAttempt} onChange={(e) => setPasswordAttempt(e.target.value)} />
                  <button onClick={() => verifyPassword()}>Submit</button>
                </div>
              )} {(
                <td>
                  <button onClick={() => setVerifyMode(!verifyMode)}>{!verifyMode ? 'Edit' : 'Cancel'}</button>
                </td>
              )} </> : ((
                <>
                  <td><button onClick={saveChanges}>Save Changes</button></td>
                  <td><button onClick={deleteAccount}>Delete Account</button></td>
                </>
              ))}
            </tr>}
          </tfoot>
        </table>
      </div>
      <CompletedGames />
    </>
  ) : (
    <h3>Loading...</h3>
  );
  
}

export default Profile
