import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { collection, getDocs, getFirestore, query, where, } from 'firebase/firestore'
import Navbar from '../Navbar/Navbar';

const TeamPage = (props) => {
  const { id } = useParams();
  const [event, setEvent] = useState([]);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    const q = query(collection(props.firestore, "teams"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setExists(true);
      setEvent(doc.data());
    })
    setLoading(false)
  }
  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <div>
      <div>
        <Navbar auth={props.auth} user={props.user} />
        {loading === false ?
          exists === false ? <h1>This Page doesnt exist</h1> :
            <>
              {loading === false ?
                <>
                  <div>
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <p>{event.id}</p>
                  </div>
                </>
                : ""}
            </>
          : ""
        }
      </div>
    </div>
  )
}

export default TeamPage
