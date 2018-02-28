import React from 'react';
import * as firebase from 'firebase';

const MAPSAPI = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
const APIKEY = 'AIzaSyD2blk49vwxtYbL4h2TYrT_QlG_5UnwIKM';

async function getData(url) {
  const getUrl = await fetch(url);
  const json = await getUrl.json();
  return json; // parses response to JSON
}

async function GetAllDistances(latitude, longitude, uRad, locations) {
  const validLocs = [];
  for (const element of locations) {
    const url = `${MAPSAPI}origins=${latitude},${longitude}&destinations=${
      element.coordinates.latitude
    },${element.coordinates.longitude}&${APIKEY}&mode=walking`;
    let newData;
    try {
      newData = await getData(url);
    } catch (e) {
      console.log(e);
    }
    const len = Object(Object(newData.rows[0]).elements[0]).distance.value;
    if (len < uRad) {
      validLocs.push(element);
    }
  }
  return validLocs;
}

async function getAllLocations(latitude, longitude, uRad) {
  const snapshot = await firebase
    .database()
    .ref('/places/')
    .once('value');
  const placeName = snapshot.val();
  const testlocations = [];
  Object.values(placeName).forEach((element) => {
    testlocations.push({
      name: element.name,
      coordinates: { latitude: element.location.lat, longitude: element.location.lng },
      image: element.image,
    });
  });
  // calback(latitude, longitude, uRad, testlocations);
  return GetAllDistances(latitude, longitude, uRad, testlocations);
}

export default async function getLocation(uPosition, uRad) {
  const { latitude } = uPosition.coordinates;
  const { longitude } = uPosition.coordinates;
  const validLocs = [];

  console.log('THIS IS BEING CALLED');
  let ar;
  try {
    ar = await getAllLocations(latitude, longitude, uRad);
  } catch (e) {
    console.log(e);
  }
  return ar[0];
}
