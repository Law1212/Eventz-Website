import React from 'react'

const FieldPageInfos = (props) => {

  return (
    <div>
      <h3>{props.field.label}</h3>
      <p>{props.field.description}</p>
      <p>{props.field.id}</p>
      <img className='coverImage' src={props.field.coverImage}></img>
    </div>
  )
}

export default FieldPageInfos
