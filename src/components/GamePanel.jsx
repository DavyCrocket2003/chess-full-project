import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './GamePanel.css'
import Messages from './Messages'

function GamePanel({emitters}) {

  const transcript = useSelector(state => state.transcript)
  const messages = useSelector(state => state.messages)
  
  const [transcriptRows, setTranscriptRows] = useState([])
  const [showResignModal, setShowResignModal] = useState(false)
  const [showDrawModal, setShowDrawModal] = useState(false)

  const buttons = {
    
  }
  const handleResign = () => {
    setShowResignModal(true)
  }

  // useEffect for updating transcript rows
  useEffect(() => {
    let myRows = []
    for (let i=0; i<(transcript?transcript.length : 0); i+=2) {
      myRows.push(
        <tr key={i} className="transcript"><td style={{textAlign: 'center', fontWeight: 700}}>{i/2 + 1} </td><td>{transcript[i]}</td><td style={{paddingLeft: '5px'}}>{transcript[i+1]}</td></tr>
      )
    }
    setTranscriptRows(myRows)
    console.log('rows', transcriptRows)
  }, [transcript])






  return (
    <div className="gamePanel">
      <div className="transcriptContainer">
        <table className="transcriptTable">
          <thead>
            <tr>
              <th style={{width: '25px', fontWeight: 'normal'}}></th><th>White </th><th style={{paddingLeft: '5px'}}>Black</th>
            </tr>
          </thead>
          <tbody>
            {transcriptRows}
          </tbody>
        </table>
      </div>

    

      
      <Messages emitMessage={emitters.emitMessage}/>
    </div>
  )
}

export default GamePanel
