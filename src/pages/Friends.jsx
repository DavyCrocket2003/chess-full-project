import React from 'react'
import { useSelector } from 'react-redux'

function Friends() {
  const username = useSelector((state) => state.userSession.username)


  return (
    <div>

      Don't worry{username ? ' ' + username[0].toUpperCase() + username.slice(1) : ''}, soon you will make some friends.
      {/* {" " + username[0].toUpperCase() + username.slice(1)}. */}
    </div>
  )
}

export default Friends
