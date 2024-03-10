import React, { useEffect } from 'react';
import {Outlet, Link} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateUserSession } from './controllers/sessionActions';
import handlerFunctions from './controllers/clientController';
import Login from './pages/Login';




export default function App() {



  const userSession = useSelector((state) => state.userSession)
  const dispatch = useDispatch()
  const sessionCheck = async () => {
    const res = await axios.get('/session-check')
    console.log(res.data)
    if (res.data.success) {
      dispatch(updateUserSession(res.data))
    }
  }


  useEffect(() => {
    sessionCheck()
  }, [])

  // function for taking a user away from a completed live game
  function handleCompletedToLoggedIn() {
    console.log('handleCompletedToLoggedIn called', userSession)
    if (userSession.status === 'completed') {
      dispatch(updateUserSession({status: 'loggedIn'}))
      axios.put(`/status/${userSession.userId}`, {status: 'loggedIn'})
    }
    dispatch({type: "UPDATE_PROFILE", payload: null})
  }




  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary" onClick={handleCompletedToLoggedIn}>
      <Container>
        <Navbar.Brand as={Link} to="/"><img
            src="./chess.jpg" alt="Chess icon" width="30" height="30" className="d-inline-block align-top"/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/live">Live Chess</Nav.Link>
            <Nav.Link as={Link} to="/computer">Computer Chess</Nav.Link>
            <Nav.Link as={Link} to="/correspondence">Correspondence Chess</Nav.Link>
            <Nav.Link as={Link} to="/messages">Messages</Nav.Link>
            <NavDropdown title={userSession.userId ? userSession.username : "User Menu"} id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/friends">Friends</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              {userSession?.userId ? (
              <NavDropdown.Item onClick={(e) => handlerFunctions.handleLogout(e, dispatch)}>Logout</NavDropdown.Item>
              ) : (
              <NavDropdown.Item as={Link} to="/">Login</NavDropdown.Item>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    {userSession.userId ? (<Outlet />) : (<Login />)}
    </>
  )
}