import React, { useEffect, useState } from 'react'
import './eventPageInfos.css'
import { collection, getDocs, getFirestore, query, where, updateDoc, doc } from 'firebase/firestore'
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '@mui/joy';
import Player from '../Player/Player';

const EventPageInfos = (props) => {
  const [user] = useAuthState(props.auth);
  const currentUser = props.auth.currentUser;
  const eventsRef = props.firestore.collection('events');
  const dbRef = props.firestore;
  const [userIsRegistered, setUserIsRegistered] = useState(true);
  const [joinWithFriendsAmount, setJoinWithFriendsAmount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [docId, setDocId] = useState(props.docId)
  const [field, setField] = useState([]);
  const [weather, setWeather] = useState();
  const date = dayjs(props.event.startTime.toDate());
  const formattedDate = date.year() + '-' + ((date.month() + 1) < 10 ? ('0' + (date.month() + 1)) : (date.month() + 1)) + '-' + ((date.date()) < 10 ? ('0' + date.date()) : (date.date()));
  const getWeather = async () => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${props.event.lat}&longitude=${props.event.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,precipitation_sum,precipitation_probability_max&timezone=auto&start_date=${formattedDate}&end_date=${formattedDate}`
      );
      const data = await response.json();
      setWeather(data);
      //console.log(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const fetchPost = async () => {
    const q = query(collection(props.firestore, "fields"), where("id", "==", props.event.field));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setField(doc.data());
    })
    getWeather();
  }
  let parts = []
  useEffect(() => {
    fetchPost()
    setUserIsRegistered(checkIfUserIsRegistered);
    getAllParticipants();
  }, []);
  useEffect(() => {

  }, [parts]);
  const clParticipants = () => {
    participants.forEach((part) => {
      console.log(part)
    })
  }
  //console.log(currentUser)
  const onSubmit = async () => {
    await updateDoc(doc(dbRef, 'events', docId), {
      participants: updateParties()
    })
    window.location.reload()
  }
  const updateParties = () => {
    let partis = props.event.participants;
    const newUid = currentUser.uid;
    partis[newUid] = joinWithFriendsAmount;
    return partis
  }
  const updateDeleteParties = () => {
    let partis = props.event.participants;
    const newUid = currentUser.uid;
    delete partis[newUid];
    return partis
  }
  const checkIfUserIsRegistered = () => {
    return props.event.participants[currentUser.uid] != undefined ? true : false
  }
  const unjoin = async () => {
    await updateDoc(doc(dbRef, 'events', docId), {
      participants: updateDeleteParties()
    })
    window.location.reload()
  }
  /**
  const [user] = useAuthState(auth);
  console.log(user)
  let userWasFound = false
  const [queryIsDone, setQueryIsDone] = useState(false)
  if (user) {
   */

  const getAllParticipants = () => {

    for (const [key, value] of Object.entries(props.event.participants)) {

      const q = query(collection(props.firestore, 'users'), where("uid", "==", key));

      getDocs(q).then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          //console.log(doc)
          //setParts(...participants, doc.data())
          parts.push(doc.data())
        })
      })
    }
    setParticipants(parts)
    //setParticipants([...participants, parts])
  }
  return (
    <div className='infos'>
      <img className='coverImage' src={props.event.coverImage}></img>
      <h3>{props.event.title}</h3>
      <p>{props.event.description}</p>
      <p>{props.event.userEmail}</p>
      <p>{props.event.priceOfEntry}</p>
      <p>{props.event.address ? props.event.city + ', ' + props.event.address : props.event.city}</p>
      <p>{'lat: ' + props.event.lat + ', lon: ' + props.event.lon}</p>
      <p>{weather?.daily.temperature_2m_max[0]}</p>
      <p>{dayjs(props.event.timeGatesOpenAt.toDate()).format('lll')}</p>
      <p>{dayjs(props.event.startTime.toDate()).format('lll')}</p>
      <p>{dayjs(props.event.finishTime.toDate()).format('lll')}</p>
      <Link to={`/field/${field.id}`}><p>{field.label}</p></Link>
      {participants && participants.map(part => <Player key={part.uid} message={part} plusPlayers={props.event.participants[part.uid]} />)}
      <div>{user ?
        <>
          {userIsRegistered ? <Button color="danger" onClick={unjoin}>Unjoin the event😭</Button> :
            <>
              <Button onClick={onSubmit}>Join the event🎲</Button>
              <input value={joinWithFriendsAmount} onChange={(event) => setJoinWithFriendsAmount(event.target.value)} type="number" name="joinWithFriendsQuantity" min="0" max="10" />
            </>
          }
        </>
        :
        <p>Not logged in</p>
      }
      </div>
    </div>
  )
}
/*(participant) => {  />
const eventsRef = props.firestore.collection('events');
const query = eventsRef.orderBy('timeListed').limit(25);
const [events] = useCollectionData(query, { idField: 'id' });
 
<div>
  {events && events.map(event => <Event key={event.id} message={event} />)}
</div>
*/


//&& props.event.userCreatedBy != user.uid // Add in live version, for debug purposes
export default EventPageInfos
