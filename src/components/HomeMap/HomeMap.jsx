import React, { useEffect, useState, useLayoutEffect, useRef } from 'react'
import mapImg from '../../images/hunagry-map-correct3.png'
import './homeMap.css'
import marker from '../../images/marker.png'
import Tooltip from '@mui/joy/Tooltip';
import { Link } from 'react-router-dom';

function convertLatLngToPixel(lat, lng, mapWidth, mapHeight, minLat, maxLat, minLng, maxLng) {
  const latScale = mapHeight / (maxLat - minLat);
  const lngScale = mapWidth / (maxLng - minLng);

  const x = (lng - minLng) * lngScale;
  const y = mapHeight - ((lat - minLat) * latScale); // Invert y-axis to match typical coordinate systems
  return { x, y };
}

const HomeMap = (props) => {

  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    const handleResize = async () => {
      if (imageRef.current) {
        const { width, height } = imageRef.current.getBoundingClientRect();
        //console.log(width + ' - ' + height)
        setImageDimensions({ width, height });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const handleImageLoad = () => {
    if (imageRef.current) {
      const { width, height } = imageRef.current.getBoundingClientRect();
      //console.log(width + ' - ' + height)
      setImageDimensions({ width, height });
    }
  };


  const [markers, setMarkers] = useState([]);

  let markerCoordinates = [{}];

  useEffect(() => {
    if (props.events !== undefined) {
      const markerCoordinates = props.events.map(event => ({
        lat: event.lat,
        lon: event.lon
      }));

      const newMarkers = markerCoordinates.map((coord, index) => {
        const { x, y } = convertLatLngToPixel(coord.lat, coord.lon, imageDimensions.width, imageDimensions.height, 45.737077, 48.582826, 16.113544, 22.896265);
        //console.log(imageDimensions.width + ' - ' + ((imageDimensions.width) * 0.6168582))
        const markerStyle = {
          position: 'absolute',
          left: x - 5, // Adjust for marker size
          top: y, // Adjust for marker size
          width: 15,
          height: 15,
          backgroundColor: 'red',
          borderRadius: '50%',
          zIndex: 1
        };
        return <Tooltip color="neutral" title={<Link to={`/event/${props.events[index].id}`}>{<div><h3>{props.events[index].title}</h3><h4>{props.events[index].city}</h4></div>}</Link>} placement="top-start"><div key={index} style={markerStyle}></div></Tooltip>;
      });

      setMarkers(newMarkers);
    }
  }, [props.events, imageDimensions.height, imageDimensions.width]);

  if (props.events != undefined) {
    markerCoordinates = props.events.map(event => ({
      lat: event.lat,
      lon: event.lon
    }));
  }

  return (
    <div className='homeMap' style={{ position: 'relative' }}>
      <img src={mapImg} ref={imageRef} alt="Map" onLoad={handleImageLoad} />
      {markers}
    </div>
  )
}

export default HomeMap
