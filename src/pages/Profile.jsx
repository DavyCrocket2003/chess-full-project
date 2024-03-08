import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import handlerFunctions from "../controllers/clientController"



function Profile() {

  const userId = useSelector(state => state.userSession.userId)
  const username = useSelector(state => state.userSession.username)
  const status = useSelector(state => state.userSession.status)

  const [editMode, setEditMode] = useState(false)
  const [userData, setUserData] = useState(null)
  const [verifyMode, setVerifyMode] = useState(false)
  const [usernameAttempt, setUsernameAttempt] = useState('')
  const [passwordAttempt, setPasswordAttempt] = useState('')
  const currentYear = new Date().getFullYear();


  console.log(userId)

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
    console.log(`Hit useEffect`)

    getUserData(userId); // Call the async function
  }, [])

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


  const dataListener = (property, value) => {
      setUserData({...userData, [property]: value})
    }


  return userData ? (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <div style={{ width: '250px', height: '250px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={userData.photoURL} 
                  alt="Description of the image" 
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
                {editMode && <input type="url" value={userData.photoURL} onChange={(e) => dataListener('photoURL', e.target.value)}></input>}
              </div>

            </td>
          </tr>
          <tr>
            <td colSpan={2}>{!editMode ? <h4>{userData.bio}</h4> : <input type="text" value={userData.bio} onChange={(e) => dataListener('bio', e.target.value)} />}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{!editMode ? userData.email : <input type="email" value={userData.email} onChange={(e) => dataListener('email', e.target.value)} />}</td>
          </tr>
          <tr>
            <td>Password:</td>
            <td>{!editMode ? '*'.repeat(userData.password.length) : <input type="password" value={userData.password} onChange={(e) => dataListener('password', e.target.value)} />}</td>
          </tr>
          <tr>
            <td>Play Sounds:</td>
            <td>{!editMode ? userData.playSound ? 'Enabled' : 'Disabled' :   <select onChange={(e) => dataListener('playSound', e.target.value)}><option value={true}>Enabled</option><option value={false}>Disabled</option></select>}</td>
          </tr>
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
          <tr>
            {!editMode ? <> {verifyMode && (
              <div>
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
          </tr>
        </tfoot>
      </table>
    </div>
  ) : (
    <h3>Loading...</h3>
  );
  
}

export default Profile
