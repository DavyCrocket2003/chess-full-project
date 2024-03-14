import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

function MessageTile({messageObj, userId, callback}) {
    const {subject, body, senderId, receiverId, createdAt} = messageObj
    const otherUser = senderId===userId ? receiverId : senderId
    const [expanded, setExpanded] = useState(false)
    const [otherData, setOtherData] = useState(null)
    const dispatch = useDispatch()
    const navigateTo = useNavigate()

    // function to get otherData from server
    function fetchUserData(id) {
        axios.get(`/users/${id}`).then(res => {
            console.log(res.data)
            if (res.data.success) {
                setOtherData(res.data.userData)
            } else {
                console.log('Error fetching user data')
            }   
        })
    }
    // gets user data from db
    useEffect(() => {
        fetchUserData(otherUser)
    }, [])

    // function to send users to the profile page for the user in this label
    const clickProfile = () => {
        dispatch({type: "UPDATE_PROFILE", payload: otherUser})
        navigateTo('/profile')
    }

    const sendMessage = () => {
        dispatch({type: "UPDATE_MESSAGE_TARGET", payload: otherUser})
    }

    const deleteMessage = () => {
        if (messageObj.status!=='normal') {
            axios.delete(`/messages/${messageObj.messageId}`)
        } else {
            axios.put('/messages', {messageId: messageObj.messageId, status: senderId===userId ? 'senderDeleted' : 'receiverDeleted'})
        }
        callback()
    }


  return otherData ? (
    <div className='messageTile' >
        <div className='labelDiv' >
        
            <div className="labelItem" >
                <div className="profileImage">
                    <img 
                    src={otherData.photoURL} 
                    alt="Profile Image" 
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        position: 'relative',
                    }} 
                    />
                </div>
            </div>
            <div className="labelItem" onClick={clickProfile}>{otherData.username}</div>
            <div className="labelItem" onClick={() => {setExpanded(!expanded)}}>{subject}</div>
        
        </div>
        {expanded && 
            <div>
                <p>
                    {body}
                </p>
                <input type="button" value={userId===senderId?"Message Again":"Message Back"} onClick={sendMessage} />
                <input type="button" value="Delete" onClick={() => deleteMessage(messageObj.messageId, userId)} />
            </div>
        }
    </div>
  ) : (
    <h4>Loading...</h4>
  )
}

export default MessageTile
