import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import Label from '../components/Label'
import axios from 'axios'


function Friends() {
  const username = useSelector((state) => state.userSession.username)
  const userId = useSelector((state) => state.userSession.userId)
  const [friendList, setFriendList] = useState(null)
  const friendsArray = friendList?.filter((friend) => friend.status==='accepted').map((friend, idx) => (
    <Label key={idx} userId={friend.userId} />
  ))
  const friendRequests = friendList?.filter((friend) => friend.status==='pending' && friend.requestedBy!==userId).map((friend, idx) => (
    <Label key={idx} userId={friend.userId} />
  ))


  const fetchFriends = () => {
    axios.get(`/friends/${userId}`)
      .then((res) => {
        setFriendList(res.data.friendList)
      })
  }

  useEffect(() => {
    fetchFriends()
  }, [])


  return (
    <div className='friendsContainer' >
      <div className='friendsBox'>
        <h4>Your Friends</h4>
        {friendList ? 
            friendsArray
        : <h4>Loading Friends...</h4>}
      </div>
      
      {friendRequests?.length>0 && (
        <div className='friendsBox'>
          <h4>Friend Requests</h4>
          <p>Click the name to go to the profile and accept</p>
          {friendRequests}
        </div>
      )}

    </div>
    )
}

export default Friends
