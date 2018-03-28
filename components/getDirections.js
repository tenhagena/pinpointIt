
import Polyline from '@mapbox/polyline';

const DIRECTIONSAPI = 'https://maps.googleapis.com/maps/api/directions/json?';
const APIKEY = 'AIzaSyB4oIF2s36OGPr_LugqibsU7fIuQ1kpjfk';
async function getData(url) {
  const getUrl = await fetch(url);
  const json = await getUrl.json();
  return json; // parses response to JSON
}

export default async function getDirections(userLocation, nextLocation) {
  const url = `${DIRECTIONSAPI}origin=${userLocation.latitude},${userLocation.longitude}&destination=${nextLocation.latitude},${nextLocation.longitude}&key=${APIKEY}&mode=walking`;
  let newData;

  try {
    newData = await getData(url);
  } catch (e) {
    console.log(e);
  }
  const points = Polyline.decode(newData.routes[0].overview_polyline.points);
  const coords = points.map((point, index) => ({
    latitude: point[0],
    longitude: point[1],
  }));
  console.log(coords);

  return coords;
}
