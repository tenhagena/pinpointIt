import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { MapView } from 'expo';
import * as firebase from 'firebase';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '85%',
  },
});

const startGame = () => {
  const user = firebase.auth().currentUser;
  console.log(`Test id ${user.uid}`);
  const key = firebase
    .database()
    .ref(`/users/${user.uid}`)
    .child('game')
    .push().key;
  firebase
    .database()
    .ref(`/users/${user.uid}`)
    .set({
      game: key,
    });
};

export default class GameMap extends React.Component {
  static navigationOptions = {
    title: 'Map',
    headerTintColor: 'blue',
  };
  constructor(props) {
    super(props);
    this.state = { markers: [] };
    this.getLocations = this.getLocations.bind(this);
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    let currentGameId;
    if (user !== null) {
      currentGameId = user.game;
    }
    if (currentGameId !== null) {
      console.log(`The current game id is ${currentGameId}`);
      this.setState({ gameID: currentGameId });
    }
  }

  getLocations() {
    const markerLocations = [];
    firebase
      .database()
      .ref('/places/')
      .once('value')
      .then((snapshot) => {
        /* snapshot.array.forEach((element) => {
          markerLocations.push(element.val());
        }); */
        const placeName = snapshot.val();
        Object.values(placeName).forEach((element) => {
          markerLocations.push({
            title: element.name,
            coordinates: { latitude: element.location.lat, longitude: element.location.lng },
          });
        });
        // console.log(markerLocations);
        this.setState({ markers: markerLocations });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: 42.3361,
            longitude: -71.0954,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider="google"
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.title}
              coordinate={marker.coordinates}
              title={marker.title}
            />
          ))}
        </MapView>
        <Button title="Get Locations" onPress={this.getLocations} />
        <Button title="Start Game" onPress={startGame} />
        <Text>Your current game ID: {this.state.gameID}</Text>
      </View>
    );
  }
}
