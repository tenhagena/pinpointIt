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
  const { key } = firebase
    .database()
    .ref(`user/${user.uid}`)
    .child('game')
    .push();
  firebase
    .database()
    .ref(`user/${user.uid}`)
    .update({
      game: key,
    });
  firebase
    .database()
    .ref('/game/')
    .child(key)
    .update({
      started: true,
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

  componentWillMount() {
    this.currentGameId();
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

  currentGameId() {
    // Check if we're in a game
    let newTest;
    const user = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/user/${user}`)
      .on('value', (snapshot) => {
        newTest = snapshot.val().game;
        this.setState({ gameID: newTest });
      });
    return newTest;
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
        {this.state.gameID != null ? (
          <Text>Your current game ID: {this.state.gameID}</Text>
        ) : (
          <Button title="Start Game" onPress={startGame} />
        )}
      </View>
    );
  }
}
