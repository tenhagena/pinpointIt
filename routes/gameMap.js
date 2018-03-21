import React from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import { MapView, Permissions, Location } from 'expo';
import * as firebase from 'firebase';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import getLocation from '../components/getLocation';
import ModalTest from '../components/newLocationModal';

import { addCurrentLocationInfo } from '../actions/actions';
// import { locale } from 'core-js/library/web/timers';

const imageMapView = require('../assets/userLocation.png');

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
    height: '100%',
  },
});

class GameMap extends React.Component {
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

    this.showModal = this.showModal.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.startGame = this.startGame.bind(this);
    this.getLocationAsync = this.getLocationAsync.bind(this);
    this.checkIn = this.checkIn.bind(this);
    this.getURad = this.getURad.bind(this);
    this.continueLocation = this.continueLocation.bind(this);
    this.updateVisitedList = this.updateVisitedList.bind(this);
    this.state = {
      markers: [],
      umarker,
      region: this.region,
      modalState: false,
      visitedList: [],
    };
  }

  componentWillMount() {
    this.currentGameId();
    this.setState({
      region: this.region,
    });
    this.getLocationAsync();
    this.getURad();
  }

  componentDidMount() {
    this.getURad();
  }

  onRegionChange(region) {
    this.setState({ region, umarker: this.umarker });
  }

  getURad() {
    const user = firebase.auth().currentUser;
    firebase
      .database()
      .ref(`/user/${user.uid}`)
      .once('value')
      .then((snapshot) => {
        this.setState({ uRad: snapshot.val().uRad });
      });
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

  // getLocations() {
  //   const markerLocations = [];
  //   firebase
  //     .database()
  //     .ref('/places/')
  //     .once('value')
  //     .then((snapshot) => {
  //       /* snapshot.array.forEach((element) => {
  //         markerLocations.push(element.val());
  //       }); */
  //       const placeName = snapshot.val();
  //       Object.values(placeName).forEach((element) => {
  //         markerLocations.push({
  //           title: element.name,
  //           coordinates: { latitude: element.location.lat, longitude: element.location.lng },
  //         });
  //       });
  //       // console.log(markerLocations);
  //       this.setState({ markers: markerLocations, region: this.region });
  //     });
  // }
  startGame() {
    this.getURad();
    getLocation(this.state.umarker, this.state.uRad, this.state.visitedList).then((nextLoc) => {
      if (nextLoc) {
        this.setState({ nextLocation: nextLoc });
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
            visited: 0,
            Score: 0,
            1: this.state.nextLocation,
            visitedList: [],
          });
      } else {
        Alert.alert(
          'No Locations Availible',
          'Please move closer to the city, or extend your game difficulty',
        );
      }
    });
  }

  continueLocation() {
    this.getURad();
    getLocation(this.state.umarker, this.state.uRad, this.state.visitedList).then((nextLoc) => {
      if (nextLoc) {
        this.setState({ nextLocation: nextLoc });
        // const user = this.state.uid;
        firebase
          .database()
          .ref(`/game/${this.state.gameID}`)
          .once('value', (snapshot) => {
            const visitedString = (snapshot.val().visited + 1).toString();
            firebase
              .database()
              .ref(`/game/${this.state.gameID}`)
              .update({
                [visitedString]: nextLoc,
              });
          });
      } else {
        Alert.alert(
          'No Locations Availible',
          'Please move closer to the city, or extend your game difficulty',
        );
      }
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
            if (newTest) {
              firebase
                .database()
                .ref(`/game/${newTest}`)
                .on('value', (snapshot) => {
                  if (snapshot.val() != null) {
                    const place = snapshot.val().Visited;
                    const stringPlace = (place + 1).toString();
                    if (snapshot.child(stringPlace).val() != null) {
                      this.setState({ nextLocation: snapshot.child(stringPlace).val() });
                    }
                  }
                });
            }
          }
        });
    }
  }
  updateVisitedList(location) {
    let visitedList = [];
    let visited;
    firebase
      .database()
      .ref(`game/${this.state.gameID}`)
      .once('value', (snapshot) => {
        ({ visited } = snapshot.val());
        if (visited > 0) {
          ({ visitedList } = snapshot.val());
        }
        visitedList.push(location);
      })
      .then(firebase
        .database()
        .ref(`game/${this.state.gameID}`)
        .update({
          visitedList,
          visited: visited + 1,
        }));
  }
  checkIn() {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    const R = 6371e3;
    const lat1 = this.state.umarker.coordinates.latitude;
    const long1 = this.state.umarker.coordinates.longitude;

    const lat2 = this.state.nextLocation.coordinates.latitude;
    const long2 = this.state.nextLocation.coordinates.longitude;

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(long2 - long1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    if (d < 30000) {
      Alert.alert('WOOOOO', 'YOU FUCKING DID IT');
      const { visitedList } = this.state;
      visitedList.push(this.state.nextLocation.placeID);
      this.setState(visitedList);
      this.updateVisitedList(this.state.nextLocation.placeID);
      this.setState({ nextLocation: null });
    } else {
      Alert.alert('Nope', `You need to move ${Math.floor(d - 30)} meters closer`);
    }
    this.setState({});
  }

  showModal() {
    this.setState({ modalState: true });
  }

  closeModal = () => {
    this.setState({ modalState: false });
  };

  render() {
    // Dispatchers
    const { currentLocationInfo } = this.props;
    // State
    const { addCurrentLocationInfo } = this.props;

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
              image={imageMapView}
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
        <Button title="Modal Test" onPress={this.showModal} />
        {this.state.gameID != null ? (
          <View
            style={{
              margin: 25,
              backgroundColor: '#3a599a',
              borderRadius: 5,
              padding: 5,
            }}
          >
            {this.state.nextLocation != null ? (
              <Button title="Check In" onPress={this.checkIn} color="#fff" />
            ) : (
              <Button title="Continue" onPress={this.continueLocation} color="#fff" />
            )}
          </View>
        ) : (
          <View
            style={{
              margin: 25,
              backgroundColor: '#3a599a',
              borderRadius: 5,
              padding: 5,
            }}
          >
            <Button title="Start Game" onPress={this.startGame} color="#fff" />
          </View>
        )}
        {/*<ModalTest
          closeModal={this.closeModal}
          showState={this.state.modalState}
          modalData={this.state.nextLocation}
        />*/}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  currentLocationInfo: state.currentLocationInfo,
});

const mapDispatchToProps = dispatch => bindActionCreators({ addCurrentLocationInfo }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);
