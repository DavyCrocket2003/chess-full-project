import React from 'react'
import { socket } from '../socket'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

function Seeks({emitters}) {

  const dispatch = useDispatch()
  const seeks = useSelector((state) => state.seeks)
  const userSession = useSelector((state) => state.userSession)
  const [entryMode, setEntryMode] = useState(false)
  const [entryFormState, setEntryFormState] = useState({name: `${userSession.username}'s Game`, rated: true, time: 300})
  

  useEffect(() => {
  }, [])


  const handleSubmitSeek = (e) => {
    e.preventDefault()
    emitters.seek(entryFormState)
    setEntryMode(false)
  }
  

    let gameRows = seeks.map((seek, index) => (
        <tr key={index}>
            <td>{userSession.status!=='seeking' && <button onClick={() => emitters.acceptSeek(seek.userId)}>Join</button>}</td>
            <td>{seek.name}</td>
            <td>{seek.owner}</td>
            <td>{seek.rating}</td>
            <td>{seek.time}</td>
            <td>{seek.rated.toString()}</td>
        </tr>
    ))


  return (
    <div>
      {entryMode && <form onSubmit={(e) => handleSubmitSeek(e)} >
        <input type="text" value={entryFormState.name} onChange={(e) => setEntryFormState({...entryFormState, name: e.target.value})} />
        <label htmlFor="rated">Rated?</label><input name="rated"type="checkbox" onChange={(e) => setEntryFormState({...entryFormState, rated: e.target.checked})} />
        <input type="text" value={entryFormState.time} onChange={(e) => setEntryFormState({...entryFormState, time: e.target.value})} />
        <input type="submit" value="Submit" />
      </form>}
      <table>
        <tbody>
          <tr>
            <td colSpan={5}>
              {userSession.status!=='seeking' ? <button onClick={() => setEntryMode(!entryMode)}>{!entryMode ? 'New Game' : 'Cancel'}</button> : <button onClick={() => emitters.cancelSeek()}>Cancel Your Game</button>}
            </td>
          </tr>
          <tr>
            <td></td>
            <td>Name</td>
            <td>Owner</td>
            <td>Rating</td>
            <td>Time Control</td>
            <td>Rated?</td>
          </tr>
          {gameRows}
        </tbody>

      </table>
    </div>
  )
}

export default Seeks
