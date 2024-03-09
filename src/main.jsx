import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import store from './redux/store.js'
import { Provider } from 'react-redux'
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom';
import Live from './pages/Live.jsx'
import Login from './pages/Login.jsx'
import Correspondence from './pages/Correspondence.jsx'
import Messages from './pages/Messages.jsx'
import Profile from './pages/Profile.jsx'
import Friends from './pages/Friends.jsx'
import Computer from './pages/Computer.jsx'
import Settings from './pages/Settings.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Login />} />
      <Route path="/live" element={<Live />} />
      <Route path="/computer" element={<Computer />} />
      <Route path="/correspondence" element={<Correspondence />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/settings" element={<Settings />} />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
,
)
