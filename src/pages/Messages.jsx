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




  
  return !messageTarget ? (
    <>
      <h3>Inbox</h3>
      {receivedMessages?.length>0 ? (
        <>
          {receivedMessages.filter(msg => msg.status!=='receiverDeleted').map((msg, idx) => (<MessageTile key={idx} messageObj={msg} userId={userId} callback={fetchMessages} />))}
        </>
      ) : (
        <p>No messages</p>
      )}
      {sentMessages?.length>0 && (
        <>
          <h3>Sent Messages</h3>
          {sentMessages.filter(msg => msg.status!=='senderDeleted').map((msg, idx) => (<MessageTile key={idx} messageObj={msg} userId={userId} callback={fetchMessages} />))}
        </>
      )}
    </>
  ) : (
    <form onSubmit={sendMessage} >
      <input type="text" placeholder='subject' value={messageData.subject} onChange={(e) => setMessageData({...messageData, subject: e.target.value})}/>
      <input type="text" placeholder='message body' value={messageData.body} onChange={(e) => setMessageData({...messageData, body: e.target.value})}/>
      <input type="submit" value="Send" />
    </form>
  )
}

export default Messages
