import SignIn from '../SignIn/SignIn';
import SignOut from '../SignOut/SignOut';
import { useAuthState } from 'react-firebase-hooks/auth';
import './navbar.css'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../../images/airsoft-hungary_logo.jpg'
import * as React from 'react';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import MoreVert from '@mui/icons-material/MoreVert';
import IconButton from '@mui/joy/IconButton';

const Navbar = (props) => {
  const [user] = useAuthState(props.auth);
  const currentUser = props.auth.currentUser;
  const [dashboardOpen, setDashboardOpen] = React.useState(false);
  const [eventOpen, setEventOpen] = React.useState(false);
  const [fieldOpen, setFieldOpen] = React.useState(false);
  const [teamOpen, setTeamOpen] = React.useState(false);

  const handleDashboardOpenChange = React.useCallback((event, isOpen) => {
    setDashboardOpen(isOpen);
  }, []);
  const handleEventOpenChange = React.useCallback((event, isOpen) => {
    setEventOpen(isOpen);
  }, []);
  const handleFieldOpenChange = React.useCallback((event, isOpen) => {
    setFieldOpen(isOpen);
  }, []);
  const handleTeamOpenChange = React.useCallback((event, isOpen) => {
    setTeamOpen(isOpen);
  }, []);
  return (
    <nav className='navbar sticky' id='header'>
      <div className='left-section'>
        <p>{user ? '' : <SignIn auth={props.auth} firebase={props.firebase} />}</p>
        <Dropdown open={dashboardOpen} onOpenChange={handleDashboardOpenChange}>
          <MenuButton>Dashboard</MenuButton>
          <Menu>
            <MenuItem><Link to={`/`}>Back home</Link></MenuItem>
          </Menu>
        </Dropdown>
        <Dropdown open={eventOpen} onOpenChange={handleEventOpenChange}>
          <MenuButton>Events</MenuButton>
          <Menu>
            <MenuItem><Link to={`/createEvent`}>Create Event</Link></MenuItem>
          </Menu>
        </Dropdown>
        <Dropdown open={fieldOpen} onOpenChange={handleFieldOpenChange}>
          <MenuButton>Locations</MenuButton>
          <Menu>
            <MenuItem><Link to={`/createField`}>Create Location</Link></MenuItem>
          </Menu>
        </Dropdown>
        <Dropdown open={teamOpen} onOpenChange={handleTeamOpenChange}>
          <MenuButton>Agencies</MenuButton>
          <Menu>
            <MenuItem><Link to={`/createTeam`}>Create Agency</Link></MenuItem>
          </Menu>
        </Dropdown>

      </div>
      <div className='right-section'>
        {currentUser ?
          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
            >
              <MoreVert />
            </MenuButton>
            {currentUser ? <Menu>
              <MenuItem><Link to={'/profile'}>Profile</Link></MenuItem>
              <MenuItem>My account</MenuItem>
              <MenuItem onClick={() => props.auth.signOut()}>Logout</MenuItem>
            </Menu> : ''}
          </Dropdown>
          : ''}
      </div>
    </nav>
  )
}

export default Navbar
