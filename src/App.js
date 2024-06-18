import React, { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from './components/Home/Home'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import { useAuthState } from 'react-firebase-hooks/auth';
import EventPage from './components/EventPage/EventPage';
import CreateEvent from './components/CreateEvent/CreateEvent';
import ProfilePage from './ProfilePage/ProfilePage';
import CreateField from './components/CreateField/CreateField';
import FieldPage from './components/FieldPage/FieldPage';
import { collection, getDocs, getFirestore, query, where, } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import RegisterProfile from './RegisterProfile';
import CreateTeam from './components/CreateTeam/CreateTeam';
import TeamPage from './components/TeamPage/TeamPage';
import Impressium from './components/Imressium/Impressium';
import apiKey from './appApi';

const app = firebase.initializeApp(
  apiKey
)

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  const [user] = useAuthState(auth);
  //console.log(user)
  let userWasFound = false
  const [queryIsDone, setQueryIsDone] = useState(false)
  if (user) {
    const q = query(collection(firestore, 'users'), where("uid", "==", user.uid));
    getDocs(q).then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        //console.log(doc.data())
        userWasFound = true;
      })
    }).then(() => {
      if (!userWasFound) {
        console.log("L")
        const listingsRef = firestore.collection('users');
        const sendListing = async () => {
          await listingsRef.add({
            age: 0,
            email: user.email,
            facebook: '',
            instagram: '',
            lastOnline: firebase.firestore.FieldValue.serverTimestamp(),
            location: '',
            name: user.displayName,
            pastGamesPlayed: {},
            pastGamesOrganised: {},
            phone: '',
            profilePic: user.photoURL,
            team: '',
            tiktok: '',
            timeRegistered: firebase.firestore.FieldValue.serverTimestamp(),
            twitter: '',
            uid: user.uid,
            youtube: '',
          });
        }
        sendListing()
      }
    })
  }

  //const usersRef = firestore.collection('users');
  //const [users] = useCollectionData(usersRef, where('uid', '==', user.uid));

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home auth={auth} firestore={firestore} firebase={firebase} />
    },
    {
      path: "/event/:id",
      element: <EventPage auth={auth} user={user} firestore={firestore} firebase={firebase} />
    },
    {
      path: "/createEvent",
      element: <CreateEvent auth={auth} user={user} firestore={firestore} firebase={firebase} app={app} />
    },
    {
      path: "/profile/:id",
      element: <ProfilePage auth={auth} user={user} firestore={firestore} firebase={firebase} app={app} />
    },
    {
      path: "/createField",
      element: <CreateField auth={auth} user={user} firestore={firestore} firebase={firebase} app={app} />
    },
    {
      path: "/createTeam",
      element: <CreateTeam auth={auth} user={user} firestore={firestore} firebase={firebase} app={app} />
    },
    {
      path: "/field/:id",
      element: <FieldPage auth={auth} user={user} firestore={firestore} firebase={firebase} />
    },
    {
      path: "/team/:id",
      element: <TeamPage auth={auth} user={user} firestore={firestore} firebase={firebase} />
    },
    {
      path: "/impressium",
      element: <Impressium auth={auth} user={user} firestore={firestore} firebase={firebase} />
    },
  ])

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
