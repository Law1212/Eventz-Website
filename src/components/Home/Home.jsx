import React from 'react'
import Navbar from '../Navbar/Navbar';
import TempEvents from '../TempEvents/TempEvents';
import Calender from '../Calender/Calender';
import HomeMap from '../HomeMap/HomeMap';
import Footer from '../Footer/Footer';
import HomeMapInteractive from '../HomeMapInteractive/HomeMapInteractive';
import { useDocumentData, useCollectionData, useCollection } from 'react-firebase-hooks/firestore';
import { getFirestore, doc, collection, query, where, orderBy } from 'firebase/firestore';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import './home.css'

const Home = (props) => {
  const eventsRef = props.firestore.collection('events');
  const eventsQuery = eventsRef.orderBy('timeListed').limit(25);
  const [events] = useCollectionData(eventsQuery, { idField: 'id' });
  const fieldsRef = props.firestore.collection('fields');
  const fieldsQuery = fieldsRef.orderBy('timeListed').limit(25);
  const [fields] = useCollectionData(fieldsQuery, { idField: 'id' });
  console.log(fields)
  return (
    <div>
      <Navbar auth={props.auth} firebase={props.firebase} />
      <HomeMapInteractive events={events} fields={fields} />
      <div className='event-calender-container'>
        <Calender />
        <TempEvents events={events} />
      </div>
      <Footer />
    </div>
  )
}

export default Home
