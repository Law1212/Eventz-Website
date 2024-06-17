import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { collection, getDocs, getFirestore, query, where, } from 'firebase/firestore'
import Navbar from '../Navbar/Navbar';
import FieldPageInfos from '../FieldPageInfos/FieldPageInfos';

const FieldPage = (props) => {
  const { id } = useParams();
  const [event, setEvent] = useState([]);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    const q = query(collection(props.firestore, "fields"), where("id", "==", id));
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
                  <FieldPageInfos field={event} auth={props.auth} user={props.user} firestore={props.firestore} firebase={props.firebase} />
                </>
                : ""}
            </>
          : ""
        }
      </div>
    </div>
  )
}

export default FieldPage
