import React from 'react'
import Navbar from '../Navbar/Navbar';

const Impressium = (props) => {
  return (
    <>
      <Navbar auth={props.auth} firebase={props.firebase} />
      <div>
        impressium lol
      </div>
    </>
  );
}

export default Impressium
