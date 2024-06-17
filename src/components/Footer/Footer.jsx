import React from 'react'
import './footer.css'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='grid-item grid-item-right'>
        <p><HelpOutlineOutlinedIcon fontSize='10px' />email@support.com</p>
        <p><WorkOutlineOutlinedIcon fontSize='10px' />email@contact.com</p>
      </div>
      <div className='grid-item grid-item-left'>
        <p><Link to='/impressium'>Impressum & Datenschutz</Link></p>
        <p><Link to='/'>Dashboard</Link></p>
      </div>
    </div>
  )
}

export default Footer
