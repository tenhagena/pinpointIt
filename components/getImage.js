const PHOTOAPI = 'https://maps.googleapis.com/maps/api/directions/json?';
const APIKEY = 'AIzaSyB4oIF2s36OGPr_LugqibsU7fIuQ1kpjfk';

async function getData(url) {
  const getUrl = await fetch(url);
  const data = await getUrl.body;
  return data; // parses response to JSON
}

export default async function getPhoto(place, width) {
  const url = `${PHOTOAPI}photoreference=${place.image}&maxwidth=${width}&key=${APIKEY}`;
  let data;

  try {
    data = await getData(url);
    console.log(data);
  } catch (e) {
    console.log(e);
  }

  return data;
}
