import React from 'react'
import { collection, getDocs, getFirestore, query, where, } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore';

const RegisterProfile = (props) => {
  const eventsRef = props.firestore.collection('users');
  const [events] = useCollectionData(query, { uid: 'id' });
  console.log(events)
  return (
    <div>

    </div>
  )
}

export default RegisterProfile
