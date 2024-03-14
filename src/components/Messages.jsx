import React, {useRef, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './Messages.css'

function Messages({emitMessage}) {

    const userColor = 'blue'    // The color that messages make usernames
    const messageContainerRef = useRef(null)
    const messages = useSelector(state => state.messages)
    const username = useSelector(state => state.userSession.username)
    const [messageInput, setMessageInput] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }, [messages])

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch({type: "UPDATE_MESSAGES", payload: {senderName: 'You', message: messageInput}})
        emitMessage(messageInput)
        setMessageInput('')
    }



  return (
    <div className='messageContainer' ref={messageContainerRef}>
      {messages.map(({senderName, message}, idx) => (
        <div key={idx}><span color={userColor}>{senderName}: </span>{message}</div>
      ))}
      <form className='chatFormContainer' onSubmit={(e) => handleSubmit(e)}>
        <input value={messageInput} type='text' placeholder='Enter your message...' onChange={(e) => setMessageInput(e.target.value)} />
        <button type='submit'>Send</button>
      </form>
    </div>
  )
}

export default Messages
