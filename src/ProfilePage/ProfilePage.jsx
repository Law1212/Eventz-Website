import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import './profilePage.css'

const ProfilePage = (props) => {

  const currentUser = props.auth.currentUser;
  console.log(currentUser)
  return (
    <>
      <Navbar auth={props.auth} user={props.user} />
      <p>Welcome to your profile</p>
      <img className='profilePic' src={currentUser.photoURL} />
      <p>{currentUser.displayName}</p>
      <p>{currentUser.email}</p>
    </>
  )
}

export default ProfilePage
