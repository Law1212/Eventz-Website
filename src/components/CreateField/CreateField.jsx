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
import './createField.css'
import Button from '@mui/joy/Button';
import Footer from '../Footer/Footer';

const CreateField = (props) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const currentUser = props.auth.currentUser;
  const [imageSizeError, setImageSizeError] = useState(false);

  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const storage = getStorage(props.app)

  const listingsRef = props.firestore.collection('fields');
  const sendListing = async (e) => {
    await listingsRef.add({
      label: e.title,
      description: e.description,
      coverImage: imageUrls[0],
      id: v4(),
      timeListed: firebase.firestore.FieldValue.serverTimestamp(),
      userCreatedBy: currentUser.uid,
      userEmail: currentUser.email,
      userProfilePic: currentUser.photoURL,
    });
  }

  const imagesListRef = ref(storage, "images/");
  const uploadFile = () => {
    if (imageUpload == null) return;
    else {
      if (imageUpload.size < 10485760) {
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setImageUrls((prev) => [...prev, url]);
          });
        });
      } else {
        setImageSizeError(true);
      }
    }
  };
  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  const schema = yup.object().shape({
    title: yup.string().required("Title required thats less than 50 characters").max(50),
    description: yup.string().required("Description required"),
  })
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    uploadFile();
    console.log(imageUpload)
    sendListing(data);
    console.log(data);
  }

  return (
    <>
      <Navbar auth={props.auth} user={props.user} />
      <div>
        <a>Welcome to the Create Location Page</a>
        <Input aria-label="Demo input" name='title' {...register('title')} placeholder="Title" />
        <a>{errors?.title?.message}</a>
        <Input aria-label="Demo input" name='description' {...register('description')} placeholder="Description" />
      </div>
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
      <Button onClick={handleSubmit(onSubmit)}>Create Field🕊</Button>
      <Footer />
    </>
  )
}

export default CreateField
