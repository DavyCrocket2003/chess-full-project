import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import MessageTile from '../components/MessageTile'

function Messages() {
  const userId = useSelector(state => state.userSession.userId)
  const messageTarget = useSelector(state => state.messageTarget)
  const dispatch = useDispatch()
  const [messageData, setMessageData] = useState({subject: '', body: ''})
  const [sentMessages, setSentMessages] = useState([])
  const [receivedMessages, setReceivedMessages] = useState([])



  const fetchMessages = () => {
    axios.get(`/receivedMessages/${userId}`).then(res => {
      console.log(res.data)
      if (res.data.success) {
        setReceivedMessages(res.data.receivedMessages)
      }
    })
    axios.get(`/sentMessages/${userId}`).then(res => {
      console.log(res.data)
      if (res.data.success) {
        setSentMessages(res.data.sentMessages)
      }
    })
  }

  // useEffect for fetching messages
  useEffect(() =>{
    fetchMessages()
  },[messageTarget])


  // self explanatory
  const sendMessage = (e) => {
    e.preventDefault()
    console.log('userId', userId, )
    axios.post('/messages', {...messageData, senderId: userId, receiverId: messageTarget}).then(res => {
      console.log(res.data)
      if (res.data.success) {
        dispatch({type: "UPDATE_MESSAGE_TARGET", payload: null})
        alert('Message sent!')
      }
    })
  }

  const receivedMessagesHTML = receivedMessages.filter(msg => msg.status!=='receiverDeleted')
  .map((msg, idx) => (
    <MessageTile
      key={idx}
      messageObj={msg}
      userId={userId}
      callback={fetchMessages}
    />))

  const sentMessagesHTML = sentMessages.filter(msg => msg.status!=='senderDeleted')
      .map((msg, idx) => (
        <MessageTile
          key={idx}
          messageObj={msg}
          userId={userId}
          callback={fetchMessages}
        />
    ))

    



  
  return !messageTarget ? (
    <div className='messagesContainer'>
      <div className='messageBox'>
        <h4 className='header'>Inbox</h4>
        {receivedMessagesHTML?.length > 0 ? receivedMessagesHTML : <p>No messages</p>}
      </div>
      {sentMessagesHTML?.length > 0 && (
        <div className='messageBox'>
          <h4 className='header'>Sent Messages</h4>
          {sentMessagesHTML}
        </div>
      )}
    </div>
  ) : (
    <div className='composeMessageBox'>
      <form onSubmit={sendMessage} >
        <input
          type="text" placeholder='subject'
          value={messageData.subject}
          style={{marginBottom: '10px'}}
          onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
        /><br/>
        <textarea
          value={messageData.body}
          onChange={(e) => setMessageData({...messageData, body: e.target.value})}
          rows={4} // Specify the number of visible text lines
          cols={50} // Specify the width of the textarea in characters
          placeholder="Enter your message here..."
        /><br/>
        <input type="submit" value="Send" />
      </form>
    </div>
  )
}

export default Messages
