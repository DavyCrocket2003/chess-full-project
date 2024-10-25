import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Messages from './Messages';
import Modal from './Modal'; // Import the modal

function StaticGamePanel({moveNumber, transcript, handleIncrement, handleDecrement}) {
  const [transcriptRows, setTranscriptRows] = useState([]);
  const transcriptRef = useRef(null)

  
  // useEffect for populating transcript rows
  useEffect(() => {
    // console.log('transcript: ', transcript)
    let myRows = [];
    for (let i = 0; i < transcript.length-1; i += 2) {
      myRows.push(
        <tr key={i} className="transcript">
          <td style={{ textAlign: 'center', fontWeight: 700}}>{i / 2 + 1} </td>
          <td style= {{backgroundColor: moveNumber===i+1 ? '#bbbbbb' : ''}}>{transcript[i]}</td>
          <td style={{ paddingLeft: '5px', backgroundColor: moveNumber===i+2 ? '#bbbbbb' : '' }}>{transcript[i + 1]}</td>
        </tr>
      );
    }
    setTranscriptRows(myRows);
  }, [transcript]);

  return (
    <div className="gamePanel">
      <div className="staticTranscriptContainer" ref={transcriptRef}>
        <table className="transcriptTable">
          <thead>
            <tr>
              <th style={{ width: '25px', fontWeight: 'normal' }}></th>
              <th>White</th>
              <th style={{ paddingLeft: '5px' }}>Black</th>
            </tr>
          </thead>
          <tbody>{transcriptRows}</tbody>
        </table>
      </div>
      <div className="arrowButtons">
        <button onClick={handleDecrement} className='gameButton imageButton'>
          <img src="../media/back.svg" alt="Back" class="buttonImage" />
        </button>
        <button onClick={handleIncrement} className='gameButton imageButton'>
          <img src="../media/forward.svg" alt="Forward" class="buttonImage" />
        </button>
      </div>
      
      {/* <Messages emitMessage={emitters.emitMessage} /> */}

    </div>
  );
}

export default StaticGamePanel;
