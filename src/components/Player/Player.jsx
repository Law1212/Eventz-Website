import React from 'react'
import { Link } from 'react-router-dom';
import './player.css'

const Player = (props) => {
  return (
    <div>
      <Link to={`/profile/${props.message.id}`}>
        <div className="listing">
          <img src={props.message.profilePic} />
          <p className='listing-info'>{props.message.name}</p>
          <p className='listing-info'>{props.plusPlayers}</p>
        </div>
      </Link>
    </div>
  )
}

export default Player
