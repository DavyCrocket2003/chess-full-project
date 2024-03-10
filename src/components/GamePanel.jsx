import React from 'react'

function GamePanel() {
  return (
    <div className="gamePanel">
      {/* Top portion: Game transcript */}
      <div className="transcriptContainer">
        <table className="transcriptTable">
          {/* Table headers */}
          <thead>
            <tr>
              <th>Move</th>
              <th>Description</th>
            </tr>
          </thead>
          {/* Table body for displaying game transcript */}
          <tbody>
            {/* Table rows will be dynamically populated with game transcript */}
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
