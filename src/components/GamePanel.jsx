import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './GamePanel.css'

function GamePanel({emitters}) {

  const transcript = useSelector(state => state.transcript)
  
  const [transcriptRows, setTranscriptRows] = useState([])
  console.log('transcript', transcript)
  useEffect(() => {
    console.log('useEffect hit')
    let myRows = []
    for (let i=0; i<(transcript?transcript.length : 0); i+=2) {
      myRows.push(
        <tr key={i} className="transcript"><td>{i+1}</td><td>{transcript[i]}</td><td>{transcript[i+1]}</td></tr>
      )
    }
    setTranscriptRows(myRows)
    console.log('rows', transcriptRows)
  }, [transcript])






  return (
    <div className="gamePanel">
      {/* Top portion: Game transcript */}
      <div className="transcriptContainer">
        <table className="transcriptTable">
          {/* Table headers */}
          <thead>
            <tr>
              <th>Move</th><th>White</th><th>Black</th>
            </tr>
          </thead>
          {/* Table body for displaying game transcript */}
          <tbody>
            {transcriptRows}
          </tbody>
        </table>
      </div>

      {/* Bottom portion: Chat area */}
      <div className="chatContainer">
        {/* Display messages */}
        <div className="messageArea">
          {/* Messages will be dynamically populated */}
        </div>
        {/* Text input for entering chat messages */}
        <input type="text" placeholder="Enter your message..." />
        {/* Button for sending messages */}
        <button>Send</button>
      </div>
    </div>
  )
}

export default GamePanel
