// DONE //
//  field refrence string
//    choose from existing fields
//  oppening, starting, finishing times
//    choose a date and time for each of these
//  entry price
//    have an entry price
//  coordinates + address
//    later
//  weather api
//    display weather condictions for the day and place of the event
//  participants
//    be able to sign up for a game with +members if needed

// TO DO-S //
//  friends on the site
//    users/userid/friends::array[strings/refrence]
//    users/userid/friendInvitationsReceived::map<key:'from whom', value='infos like time of sending'>
//  manage friends
//    load users/userid/friends::array[strings/refrence]
//  createTeam
//    path: "/createTeam",
//        element: <CreateTeamPage auth={auth} user={user} firestore={firestore} firebase={firebase} app={app} />
//  looks at a team page
//      path: "/team/:id",
//        element: <TeamPage auth={auth} user={user} firestore={firestore} firebase={firebase} app={app} />
//  invite to team
//    users/userid/team && if(users/userid/administrator == true) {you can invite with a button on their profile page}
//    users/userid/teamInvitationsReceived::map<key:'from which team', value='infos like time of sending'>  
//  team administrator
//    new collection teams
//      infos of the team
//  profile page fix
//  edit profile page
//  other organisers
//    choose from your friends
//  manage existing events
//    updating the stuff
//  manage profile
//    updating the stuff
//  manage field
//  comments under an event
//  description tool

import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar/Navbar';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import Input from '@mui/joy/Input';
import { v4 } from 'uuid'
import firebase from 'firebase/compat/app';
import {
  getStorage, uploadBytes, getDownloadURL, listAll,
  list,
} from 'firebase/storage';
import { ref } from 'firebase/storage';
import uploadImg from '../../images/Upload.png'
import './createEvent.css'
import Button from '@mui/joy/Button';
import Autocomplete from '@mui/joy/Autocomplete';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { NumericFormat } from 'react-number-format';
import PropTypes from 'prop-types';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import Footer from '../Footer/Footer';
import weekday from 'dayjs/plugin/weekday'

const NumericFormatAdapter = React.forwardRef(
  function NumericFormatAdapter(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        suffix=" Ft"
      />
    );
  },
);
NumericFormatAdapter.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
const CreateEvent = (props) => {
  const [location, setLocation] = useState({ lat: 0, lon: 0 });
  const [cityName, setCityName] = useState('');
  const [address, setAddress] = useState('');
  const [map, setMap] = useState();
  const [price, setPrice] = React.useState('');
  dayjs.extend(weekday);
  const currentUser = props.auth.currentUser;
  const [field, setField] = useState(null);
  const handleFieldChange = (event, newValue) => {
    setField(newValue);
  };
  const [gateOpenTime, setGateOpenTime] = React.useState(dayjs().add(1, 'week').weekday(6).hour(8).minute(0));
  const [startTime, setStartTime] = React.useState(dayjs().add(1, 'week').weekday(6).hour(10).minute(0));
  const [finishTime, setFinishTime] = React.useState(dayjs().add(1, 'week').weekday(6).hour(16).minute(0));

  const [imageSizeError, setImageSizeError] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [sendListingCalled, setSendListingCalled] = useState(false);
  const [formData, setFormData] = useState([]);
  const storage = getStorage(props.app)
  //console.log(imageUrls)
  const eventsRef = props.firestore.collection('fields');
  const query = eventsRef.orderBy('label');
  const [fields] = useCollectionData(query, { idField: 'id' });

  const listingsRef = props.firestore.collection('events');
  const sendListing = async (e) => {
    await listingsRef.add({
      title: e.title,
      description: e.description,
      coverImage: imageUrls,
      field: field.id,
      fieldName: field.label,
      id: v4(),
      priceOfEntry: price,
      city: cityName,
      address: address,
      lat: location.lat,
      lon: location.lon,
      participants: {},
      timeListed: firebase.firestore.FieldValue.serverTimestamp(),
      timeGatesOpenAt: firebase.firestore.Timestamp.fromDate(gateOpenTime.toDate()),
      startTime: firebase.firestore.Timestamp.fromDate(startTime.toDate()),
      finishTime: firebase.firestore.Timestamp.fromDate(finishTime.toDate()),
      userCreatedBy: currentUser.uid,
      userEmail: currentUser.email,
      userProfilePic: currentUser.photoURL,
    });
  }

  const imagesListRef = ref(storage, "images/");
  const uploadFile = async () => {
    let myPromise = new Promise(function (resolve) {
      if (imageUpload == null) resolve("No file was found");
      else {
        if (imageUpload.size < 10485760) {
          const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
          uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              setImageUrls(url);
              resolve("Made it")
            });
          });
        } else {
          resolve("Image was too big")
          setImageSizeError(true);
        }
      }
    })
    console.log(await myPromise)
  };
  useEffect(() => {
    if (imageUrls.length > 0 && !sendListingCalled) {
      // Call sendListing only when imageUrls has been updated and sendListing hasn't been called yet
      sendListing(formData);
      // Set the flag to true to indicate that sendListing has been called
      setSendListingCalled(true);
    }
  }, [imageUrls, formData, sendListingCalled]);

  const schema = yup.object().shape({
    title: yup.string().required("Title required thats less than 50 characters").max(50),
    description: yup.string().required("Description required"),
  })
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    uploadFile();
    setFormData(data)
  }
  useEffect(() => {
    const handleSearch = async () => {
      try {
        console.log("response was tried")
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${cityName + " " + address}`
        );
        const data = await response.json();
        if (data.length > 0) {
          console.log(data[0].lat + " " + data[0].lon)
          const { lat, lon } = data[0];
          setLocation({ lat, lon });
          console.log(map)
          map.target.setView([lat, lon])

        } else {
          setLocation({ lat: 0, lon: 0 });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (cityName.trim() !== '') {
      handleSearch();
    } else {
      setLocation({ lat: 0, lon: 0 });
    }
  }, [cityName, address])

  return (
    <>
      <Navbar auth={props.auth} user={props.user} />
      <a>Welcome to the Create Event Page</a>
      <div className='mainDiv'>

        <Input aria-label="Demo input" name='title' {...register('title')} placeholder="Title" sx={{ width: 300 }} />
        <a>{errors?.title?.message}</a>
        <Input aria-label="Demo input" name='description' {...register('description')} placeholder="Description" sx={{ width: 300 }} />
        <Autocomplete
          placeholder="Location Name"
          options={fields}
          sx={{ width: 300 }}
          value={field}
          onChange={handleFieldChange}
        />
        <Input
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Price of entry"
          slotProps={{
            input: {
              component: NumericFormatAdapter,
            },
          }}
          sx={{ width: 300 }}
        />

      </div>
      <div className='dateDiv'>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker disablePast label="Opening time of the gates" sx={{ width: 600 }} value={gateOpenTime}
              onChange={(newValue) => setGateOpenTime(newValue)} />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker disablePast label="Start of the game" sx={{ width: 600 }} value={startTime}
              onChange={(newValue) => setStartTime(newValue)} />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker disablePast label="End of the game" sx={{ width: 600 }} value={finishTime}
              onChange={(newValue) => setFinishTime(newValue)} />
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <div className='mainDiv'>
        <Input aria-label="Demo input" value={cityName} onChange={(e) => setCityName(e.target.value)} name='cityName' placeholder="City name" sx={{ width: 300 }} />
        <Input aria-label="Demo input" value={address} onChange={(e) => setAddress(e.target.value)} name='address' placeholder="Address" sx={{ width: 300 }} />
        <p>lat: {location.lat}, <br />lon: {location.lon}</p>
      </div>
      <MapContainer whenReady={setMap} className='map' center={[location.lat, location.lon]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lon]}>
        </Marker>
      </MapContainer>

      <div className="app">
        <div className="parent">
          <div className="file-upload">
            <img src={uploadImg} alt="upload" className='image' />
            <p>Maximal file size: 10MB</p>
            <input type='file' onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }} />
            {imageSizeError != false ? 'Its too big omg' : ''}
          </div>
        </div>
      </div>
      <div>
        <Button onClick={handleSubmit(onSubmit)}>Post Event🚩</Button>
      </div>
      <Footer />
    </>
  )
}
export default CreateEvent
