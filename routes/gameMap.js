import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { MapView, Permissions, Constants, Location } from 'expo';
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
    var umarker = {
      title: "You"
    }
    this.state = { markers: [], umarker: umarker };
    this.getLocations = this.getLocations.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  componentWillMount() {
    this.currentGameId();
    this.setState({
      region: {
        latitude: 42.3361,
        longitude: -71.0954,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    });
    this._getLocationAsync();
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



  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    await Location.watchPositionAsync({ distanceInterval: 0.1, enableHighAccuracy: true }, (location) => {
      var element = {
        title: "You",
        coordinates: { latitude: location.coords.latitude, longitude: location.coords.longitude },
      };
      this.setState({ umarker: element })
    });

  }

  onRegionChange(region) {
    this.setState({ region: region });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
          style={styles.map}

          provider="google"
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.title}
              coordinate={marker.coordinates}
              title={marker.title}
            />
          ))}

          <MapView.Marker
            image={require('../assets/userLocation.png')}
            key={this.state.umarker.title}
            coordinate={this.state.umarker.coordinates}
            title={this.state.umarker.title}
          />
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
