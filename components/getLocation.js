import React from 'react';
import * as firebase from 'firebase';

const MAPSAPI = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
const APIKEY = 'AIzaSyB4oIF2s36OGPr_LugqibsU7fIuQ1kpjfk';
async function getData(url) {
  const getUrl = await fetch(url);
  const json = await getUrl.json();
  return json; // parses response to JSON
}

async function GetAllDistances(latitude, longitude, uRad, locations) {
  const validLocs = [];
  let url = `${MAPSAPI}origins=${latitude},${longitude}&destinations=`;
  for (const element of locations) {
    url += `${element.coordinates.latitude},${element.coordinates.longitude}|`;
  }
  url = url.slice(0, -1);
  url += `&key=${APIKEY}&mode=walking`;
  let newData;
  try {
    newData = await getData(url);
  } catch (e) {
    console.log(e);
  }
  for (const [index, value] of Object(newData.rows[0].elements).entries()) {
    if (value.distance.value < uRad) {
      validLocs.push(locations[index]);
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
  const keysOfLocs = [];
  Object.keys(placeName).forEach((element) => {
    keysOfLocs.push(element);
  });
  Object.values(placeName).forEach((element, index) => {
    testlocations.push({
      placeID: keysOfLocs[index],
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

  let ar;
  try {
    ar = await getAllLocations(latitude, longitude, uRad);
    return ar[Math.floor(Math.random() * ar.length)];
  } catch (e) {
    console.log(e);
    return null;
  }
}