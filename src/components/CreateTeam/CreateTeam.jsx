import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar/Navbar';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import Input from '@mui/joy/Input';
import { v4 } from 'uuid'
import firebase from 'firebase/compat/app';
import {
  getStorage, uploadBytes, getDownloadURL,
} from 'firebase/storage';
import { ref } from 'firebase/storage';
import uploadImg from '../../images/Upload.png'
import './createTeam.css'
import Button from '@mui/joy/Button';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, } from 'react-leaflet'
import Typography from '@mui/joy/Typography';
import Switch from '@mui/joy/Switch';
import Footer from '../Footer/Footer';

const CreateTeam = (props) => {
  //general
  const storage = getStorage(props.app)
  const currentUser = props.auth.currentUser;
  const [sendListingCalled, setSendListingCalled] = useState(false);
  const [formData, setFormData] = useState([]);
  const [contactInfoDesc, setContactInfoDesc] = useState('');
  const [isLookingForNewMembers, setIsLookingForNewMembers] = useState(false);
  //location
  const [location, setLocation] = useState({ lat: 0, lon: 0 });
  const [cityName, setCityName] = useState('');
  const [map, setMap] = useState();
  //image
  const [imageSizeError, setImageSizeError] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [logoUpload, setLogoUpload] = useState(null);
  const [logo, setLogo] = useState('');
  //socials
  const [discord, setDiscord] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [twitter, setTwitter] = useState('');
  const [youtube, setYoutube] = useState('');

  const listingsRef = props.firestore.collection('teams');
  const sendListing = async (e) => {
    await listingsRef.add({
      abbreviation: e.abbreviation,
      administrator: currentUser.uid,
      city: cityName,
      contactInfoDesc: contactInfoDesc,
      coverImage: imageUrls,
      description: e.description,
      discord: discord,
      email: email,
      facebook: facebook,
      id: v4(),
      instagram: instagram,
      isLookingForNewMembers: isLookingForNewMembers,
      lastGameAttended: {},
      lat: location.lat,
      logo: '',
      lon: location.lon,
      members: {},
      name: e.title,
      otherImages: [],
      telegram: telegram,
      tiktok: tiktok,
      timeCreated: firebase.firestore.FieldValue.serverTimestamp(),
      twitter: twitter,
      youtube: youtube,
    });
  }
  const uploadFile = async (img) => {
    let myPromise = new Promise(function (resolve) {
      if (img == null) resolve("No file was found");
      else {
        if (img.size < 10485760) {
          const imageRef = ref(storage, `images/${img.name + v4()}`);
          uploadBytes(imageRef, img).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
              resolve("Made it")
              return url;

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
    setImageUrls(uploadFile(imageUpload));
    uploadFile();
    setFormData(data)
  }
  useEffect(() => {
    const handleSearch = async () => {
      try {
        console.log("response was tried")
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${cityName}`
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
  }, [cityName])
  const toggleIsLookingForNewMembers = () => {
    setIsLookingForNewMembers(!isLookingForNewMembers)
  }
  useEffect(() => {
    if (isLookingForNewMembers == false)
      setContactInfoDesc('')
  }, [isLookingForNewMembers])
  return (
    <>
      <Navbar auth={props.auth} user={props.user} />
      <a>Welcome to the Create Agency Page</a>
      <div className='mainDiv'>
        <Input aria-label="Demo input" name='title' {...register('title')} placeholder="Title" sx={{ width: 300 }} />
        <Input aria-label="Demo input" name='description' {...register('description')} placeholder="Description" sx={{ width: 300 }} />
        <Input aria-label="Demo input" name='abbreviation' {...register('abbreviation')} placeholder="Abbreviation" sx={{ width: 300 }} />
        <Input aria-label="Demo input" value={cityName} onChange={(e) => setCityName(e.target.value)} name='cityName' placeholder="City name" sx={{ width: 300 }} />
        <Typography component="label" endDecorator={<Switch checked={isLookingForNewMembers} onChange={toggleIsLookingForNewMembers} sx={{ ml: 1 }} />}>
          Looking for new members
        </Typography>
        {isLookingForNewMembers ? <Input aria-label="Demo input" value={contactInfoDesc} onChange={(e) => setContactInfoDesc(e.target.value)} name='contactInfoDesc' placeholder="contactInfoDesc" sx={{ width: 300 }} /> : ''}
        <Input aria-label="Demo input" value={discord} onChange={(e) => setDiscord(e.target.value)} name='discord' placeholder="discord" sx={{ width: 300 }} />
        <Input aria-label="Demo input" value={email} onChange={(e) => setEmail(e.target.value)} name='email' placeholder="email" sx={{ width: 300 }} />
        <Input aria-label="Demo input" value={facebook} onChange={(e) => setFacebook(e.target.value)} name='facebook' placeholder="facebook" sx={{ width: 300 }} />
        <Input aria-label="Demo input" value={instagram} onChange={(e) => setInstagram(e.target.value)} name='instagram' placeholder="instagram" sx={{ width: 300 }} />
        <Input aria-label="Demo input" value={telegram} onChange={(e) => setTelegram(e.target.value)} name='telegram' placeholder="telegram" sx={{ width: 300 }} />
        <Input aria-label="Demo input" value={tiktok} onChange={(e) => setTiktok(e.target.value)} name='tiktok' placeholder="tiktok" sx={{ width: 300 }} />
        <Input aria-label="Demo input" value={twitter} onChange={(e) => setTwitter(e.target.value)} name='twitter' placeholder="twitter" sx={{ width: 300 }} />
        <Input aria-label="Demo input" value={youtube} onChange={(e) => setYoutube(e.target.value)} name='youtube' placeholder="youtube" sx={{ width: 300 }} />

      </div>
      <MapContainer whenReady={setMap} className='map' center={[location.lat, location.lon]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lon]}>
        </Marker>
      </MapContainer>

      <div className='tpbp'>
        <p >Agency page background picture</p>
      </div>
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
      <div className='tpbp'>
        <p >Agency logo</p>
      </div>
      <div className="parent">
        <div className="file-upload">
          <img src={uploadImg} alt="upload" className='image' />
          <p>Maximal file size: 10MB</p>
          <input type='file' onChange={(event) => {
            setLogoUpload(event.target.files[0]);
          }} />
          {imageSizeError != false ? 'Its too big omg' : ''}
        </div>
      </div>

      <div>
        <Button onClick={handleSubmit(onSubmit)}>Post Event🚩</Button>
      </div>
      <Footer />
    </>
  )
}
export default CreateTeam
