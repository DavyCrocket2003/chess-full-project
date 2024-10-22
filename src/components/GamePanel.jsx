import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './GamePanel.css';
import Messages from './Messages';
import Modal from './Modal'; // Import the modal

function GamePanel({ emitters, status, acceptDrawModal: {showAcceptDrawModal, setShowAcceptDrawModal}}) {
  const transcript = useSelector((state) => state.transcript);
  const [transcriptRows, setTranscriptRows] = useState([]);
  const [showResignModal, setShowResignModal] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const transcriptRef = useRef(null)

  // Event handlers for modal actions
  const handleResign = () => {
    if (status==='inGame')
      setShowResignModal(true); // Open the resign confirmation modal
  };

  const confirmResign = () => {
    console.log('Player has resigned');
    setShowResignModal(false); // Close modal after confirming
    emitters.resign()

  };

  const cancelResign = () => {
    setShowResignModal(false); // Close modal without resigning
  };

  const handleDraw = () => {
    if (status==='inGame')
      setShowDrawModal(true); // Open the draw offer confirmation modal
  };

  const confirmDraw = () => {
    console.log('Player offered a draw');
    setShowDrawModal(false); // Close modal after confirming
    emitters.drawOffer()
  };

  const cancelDraw = () => {
    setShowDrawModal(false); // Close modal without offering a draw
  };

  const handleAcceptDrawOffer = () => {
    setShowAcceptDrawModal(false)
    emitters.draw() 
  }

  // useEffect for updating transcript rows
  useEffect(() => {
    let myRows = [];
    for (let i = 0; i < (transcript ? transcript.length : 0); i += 2) {
      myRows.push(
        <tr key={i} className="transcript">
          <td style={{ textAlign: 'center', fontWeight: 700 }}>{i / 2 + 1} </td>
          <td>{transcript[i]}</td>
          <td style={{ paddingLeft: '5px' }}>{transcript[i + 1]}</td>
        </tr>
      );
    }
    setTranscriptRows(myRows);

    // Scroll to the bottom when new moves are added
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="gamePanel">
      <div className="transcriptContainer" ref={transcriptRef}>
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

      <div className="controlButtons">
        <button id='resignButton' onClick={handleResign} className={`gameButton ${status!=='inGame'?'disabled':''}`}>Resign</button>
        <button id='drawButton' onClick={handleDraw} className={`gameButton ${status!=='inGame'?'disabled':''}`}>Draw</button>
      </div>

      {/* Resign Confirmation Modal */}
      <Modal
        isOpen={showResignModal}
        title="Confirm Resignation"
        message="Are you sure you want to resign?"
        onConfirm={confirmResign}
        onCancel={cancelResign}
      />

      {/* Draw Offer Confirmation Modal */}
      <Modal
        isOpen={showDrawModal}
        title="Offer Draw"
        message="Do you want to offer a draw?"
        onConfirm={confirmDraw}
        onCancel={cancelDraw}
      />

      {/* Accept Draw Offer Confirmation Modal */}
      <Modal
        isOpen={showAcceptDrawModal}
        title="Accept Draw"
        message="You've been offered a draw. Do you accept?"
        onConfirm={handleAcceptDrawOffer}
        onCancel={()=>setShowAcceptDrawModal(false)}
      />

      <Messages emitMessage={emitters.emitMessage} />
    </div>
  );
}

export default GamePanel;
