import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'

// random comment

function Settings() {

  const userId = useSelector((state) => state.userSession.userId)
  const [editMode, setEditMode] = useState(false)
  const [userSettings, setUserSettings] = useState(null)
  const getUserSettings = async (id) => {
    try {
      const {data} = await axios.get(`/users/${id}`); // Fetch data asynchronously
      console.log(data)
      setUserSettings(data.userData); // Update state with the fetched data
    } catch (error) {
      console.error('Error fetching settings: ', error);
    }
  }
  
  // Use useEffect to fetch user settings when the component mounts
  useEffect(() => {
    console.log(`Hit useEffect`)

    getUserSettings(userId); // Call the async function
  }, [])

  const settingsListener = (property, value) => {
    setUserSettings({...userSettings, [property]: value})
  }

  const handleEditButton = () => {
    if (editMode) {
      let data = {...userSettings}
      if (!['old','new'].includes(userSettings.pieceStyle)) {
        setUserSettings({...userSettings, pieceStyle: 'new'})
      }
      axios.put('/users', {userId, data})
    }
    setEditMode(!editMode)
  }




  return userSettings ? (
    <div className='styledContainer settingsBox'>
      <table className='settingsTable'>
        <tbody>
          <tr>
            <td>White Squares Color:</td>
            <td>{!editMode ? userSettings.whiteColor : <input type="text" value={userSettings.whiteColor} onChange={(e) => settingsListener('whiteColor', e.target.value)} />}</td>
          </tr>
          <tr>
            <td>Black Squares Color:</td>
            <td>{!editMode ? userSettings.blackColor : <input type="text" value={userSettings.blackColor} onChange={(e) => settingsListener('blackColor', e.target.value)} />}</td>
          </tr>
          <tr>
            <td>Play Sounds:</td>
            <td>{!editMode ? {true: 'Enabled', false: 'Disabled'}[userSettings.playSound] :   <select value={userSettings.playSound.toString()} onChange={(e) => settingsListener('playSound', e.target.value)}><option value='true'>Enabled</option><option value="false">Disabled</option></select>}</td>
          </tr>
          <tr>
            <td>Board Layout:</td>
            <td>{!editMode ? [userSettings.onBottom] :   <select value={userSettings.onBottom.toString()} onChange={(e) => settingsListener('onBottom', e.target.value)}><option value='regular'>Regular</option><option value="flipped">Flipped</option></select>}</td>
          </tr>
          <tr>
            <td>Piece Style (old or new): </td>
            <td>{!editMode ? `'${userSettings.pieceStyle}'` : <input type="text" value={userSettings.pieceStyle} onChange={(e) => settingsListener('pieceStyle', e.target.value)} />}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr><td><button onClick={handleEditButton}>{!editMode ? 'Edit' : 'Save'}</button></td></tr>
        </tfoot>
      </table>
    </div>
  ) : (
    <h3>Loading...</h3>
  )
}

export default Settings
