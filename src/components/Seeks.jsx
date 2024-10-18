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
  
  const handleSubmitSeek = (e) => {
    e.preventDefault()
    emitters.seek(entryFormState)
    setEntryMode(false)
  }
  

    let gameRows = seeks.map((seek, index) => (
        <tr key={index}>
            <td className='paddedRight'>{userSession.status!=='seeking' && !entryMode && <button onClick={() => emitters.acceptSeek(seek.userId)}>Join</button>}</td>
            <td className='paddedRight'>{seek.name}</td>
            <td className='paddedRight'>{seek.owner}</td>
            <td className='paddedRight'>{seek.rating}</td>
            {/* <td className='paddedRight'>{seek.time}</td> */}
            <td>{seek.rated?'Yes':'No'}</td>
        </tr>
    ))


  return (
    <>
    <div className='styledContainer' id='seeksForm'>
      {entryMode && <form onSubmit={(e) => handleSubmitSeek(e)} >
        <input type="text" value={entryFormState.name} onChange={(e) => setEntryFormState({...entryFormState, name: e.target.value})} /><br/>
        <label htmlFor="rated" style={{marginRight: '4px'}}>Rated?</label><input className='seeksFormElement' name="rated"type="checkbox" onChange={(e) => setEntryFormState({...entryFormState, rated: e.target.checked})} />
        {/* <input type="text" value={entryFormState.time} onChange={(e) => setEntryFormState({...entryFormState, time: e.target.value})} /><br/> */}
        <input type="submit" value="Submit" className='seeksFormElement' /><button className='seeksFormElement' onClick={() => setEntryMode(false)}>Cancel</button>
      </form>}
      {userSession.status==='seeking' ? <button onClick={() => emitters.cancelSeek()}>Cancel Your Game</button> : (!entryMode && <button style={{display: 'block'}} onClick={() => setEntryMode(true)}>New Game</button>) }
    </div>
    <div className='styledContainer' id='seeksBox'>
      <table>
        <tbody>
          <tr>
            
          </tr>
          <tr className='boldText'>
            <td className='paddedRight'></td>
            <td className='paddedRight'>Name</td>
            <td className='paddedRight'>Owner</td>
            <td className='paddedRight'>Rating</td>
            {/* <td className='paddedRight'>Time Control</td> */}
            <td className='paddedRight'>Rated?</td>
          </tr>
          {gameRows}
        </tbody>

      </table>
    </div>
    </>
  )
}

export default Seeks
