import React from 'react';
import * as firebase from 'firebase';

const MAPSAPI = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
const APIKEY = 'AIzaSyD2blk49vwxtYbL4h2TYrT_QlG_5UnwIKM';

async function getAllLocations(latitude, longitude, uRad, calback) {
  firebase
    .database()
    .ref('/places/')
    .once('value')
    .then((snapshot) => {
      /* snapshot.array.forEach((element) => {
            markerLocations.push(element.val());
          }); */
      const placeName = snapshot.val();
      const testlocations = [];
      Object.values(placeName).forEach((element) => {
        testlocations.push({
          name: element.name,
          coordinates: { latitude: element.location.lat, longitude: element.location.lng },
          image: element.image,
        });
      });
      return calback(latitude, longitude, uRad, testlocations);
    });
}
function getData(url) {
  return fetch(url).then(response => response.json()); // parses response to JSON
}

async function GetAllDistances(latitude, longitude, uRad, locations) {
  const validLocs = [];
  locations
    .forEach((element) => {
      const url = `${MAPSAPI}origins=${latitude},${longitude}&destinations=${
        element.coordinates.latitude
      },${element.coordinates.longitude}&${APIKEY}&mode=walking`;
      return getData(url).then((data) => {
        const len = Object(Object(data.rows[0]).elements[0]).distance.value;
        if (len < uRad) {
          validLocs.push(element);
          console.log(element);
        }
      });
    })
    .then(() => validLocs);
}

export default async function getLocation(uPosition, uRad) {
  const { latitude } = uPosition.coordinates;
  const { longitude } = uPosition.coordinates;
  const validLocs = [];

  console.log('THIS IS BEING CALLED');
  const ar = await getAllLocations(latitude, longitude, uRad, GetAllDistances).then(() => {
    console.log(ar[0]);
  });
}
