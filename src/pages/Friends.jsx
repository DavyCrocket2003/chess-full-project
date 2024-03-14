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
    <div className='styledContainer' id='friendBox'>
      <h3>Your Friends</h3>
      {friendList ? (
        <div>
          {friendsArray}
        </div>
      ) : <h3>Loading Friends...</h3>}
      
      {friendRequests?.length>0 && (
        <div>
          <h3>Friend Requests</h3>
          <p>Click the name to go to the profile and accept</p>
          {friendRequests}
        </div>
      )}

    </div>
    )
}

export default Friends
