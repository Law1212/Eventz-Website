import React, { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import './homeMapInteractive.css'
import L from 'leaflet';
import marker from '../../images/marker.png'
import markerBlue from '../../images/marker-blue.png'

const HomeMapInteractive = (props) => {
  let markers = [];
  const customIcon = L.icon({
    iconUrl: marker,
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
  });
  if (props.events != undefined && props.fields != undefined) {
    const events = props.events;
    const fields = props.fields;
    console.log(fields[0].lat)
    for (let i = 0; i < fields.length; i++) {
      let isActive = false;
      let event = {};
      for (let j = 0; j < events.length; j++) {
        if (fields[i].id == events[j].field) {
          isActive = true;
          event = events[j]
        }
      }


      if (isActive) {
        markers.push({
          marker: L.icon({
            iconUrl: marker,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          }),
          lat: fields[i].lat,
          lon: fields[i].lon,
          infos: {
            title: event.title,
            img: event.coverImage,
            isActive: true,
          }
        })
      } else {
        markers.push({
          marker: L.icon({
            iconUrl: markerBlue,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          }),
          lat: fields[i].lat,
          lon: fields[i].lon,
          infos: {
            title: fields[i].label,
            img: fields[i].coverImage,
            isActive: false,
          }
        })
      }
    }
  }


  return (
    <div>
      <MapContainer className='homeMapInteractive' center={[51.1, 10.4]} zoom={6} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {markers && markers.map(marker =>
          <Marker key={marker.id} position={[marker.lat, marker.lon]} icon={marker.marker}>
            <Popup className="custom-popup">
              {marker.infos.isActive ? <h5>Next event at the field: </h5> : <h5>Field info:</h5>}
              <div className="popup-content">
                <img className='popupImg' src={marker.infos.img} alt="Popup Image" />
                <div className="popup-text">{marker.infos.title}</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default HomeMapInteractive
