import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { MapView, Permissions, Location } from 'expo';
import * as firebase from 'firebase';
import getLocation from '../components/getLocation';

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

export default class GameMap extends React.Component {
  static navigationOptions = {
    title: 'Map',
    headerTintColor: 'blue',
  };
  constructor(props) {
    super(props);
    this.region = {
      latitude: 42.3361,
      longitude: -71.0954,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    const umarker = {
      title: 'You',
      coordinates: { latitude: 0, longitude: 0 },
    };
    this.state = { markers: [], umarker, region: this.region };
    this.getLocations = this.getLocations.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentWillMount() {
    this.currentGameId();
    this.setState({
      region: this.region,
    });
    this.getLocationAsync();
  }

  onRegionChange(region) {
    this.setState({ region, umarker: this.umarker });
  }

  async getLocationAsync() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log(status);
    }
    await Location.watchPositionAsync(
      { distanceInterval: 1, enableHighAccuracy: true },
      (location) => {
        const element = {
          title: 'You',
          coordinates: { latitude: location.coords.latitude, longitude: location.coords.longitude },
        };
        this.umarker = element;
      },
    );
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
        this.setState({ markers: markerLocations, region: this.region });
      });
  }
  startGame() {
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
    getLocation(this.state.umarker, 100000).then((nextLoc) => {
      console.log(nextLoc);
      this.setState({ nextLocation: nextLoc });
    });
  }

  currentGameId() {
    // Check if we're in a game
    let newTest;
    const user = firebase.auth().currentUser.uid;
    if (user) {
      firebase
        .database()
        .ref(`/user/${user}`)
        .on('value', (snapshot) => {
          if (snapshot.val() != null) {
            newTest = snapshot.val().game;
            this.setState({ gameID: newTest });
          }
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
          style={styles.map}
          showsUserLocation={this.state.umarker != null}
          provider="google"
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.title}
              coordinate={marker.coordinates}
              title={marker.title}
            />
          ))}

          {this.state.nextLocation != null ? (
            <MapView.Marker
              image={require('../assets/userLocation.png')}
              key={this.state.nextLocation.name}
              coordinate={this.state.nextLocation.coordinates}
              title={this.state.nextLocation.name}
            />
          ) : null}

          {/* <MapView.Marker
            image={require('../assets/userLocation.png')}
            key={this.state.umarker.title}
            coordinate={this.state.umarker.coordinates}
            title={this.state.umarker.title}
          /> */}
        </MapView>
        <Button title="Get Locations" onPress={this.getLocations} />
        {this.state.gameID != null ? (
          <Text>Your current game ID: {this.state.gameID}</Text>
        ) : (
          <Button title="Start Game" onPress={this.startGame} />
        )}
      </View>
    );
  }
}
