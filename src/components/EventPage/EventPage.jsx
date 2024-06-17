import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { collection, getDocs, getFirestore, query, where, } from 'firebase/firestore'
import Navbar from '../Navbar/Navbar';
import EventPageInfos from '../EventPageInfos/EventPageInfos';
import './eventPage.css'

const EventPage = (props) => {
  const { id } = useParams();
  const [event, setEvent] = useState([]);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [docId, setDocId] = useState('lol');


  const fetchPost = async () => {
    const q = query(collection(props.firestore, "events"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setExists(true);
      setEvent(doc.data());
      setDocId(doc.id);
    })
    setLoading(false)
  }
  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div>
      <Navbar auth={props.auth} user={props.user} />
      {loading === false ?
        exists === false ? <h1>This Page doesnt exist</h1> :
          <>
            {loading === false ?
              <>
                <EventPageInfos docId={docId} event={event} auth={props.auth} user={props.user} firestore={props.firestore} firebase={props.firebase} />
              </>
              : ""}
          </>
        : ""
      }
    </div>
  )
}

export default EventPage
