import React from 'react';
import { StyleSheet, View, Button, Alert, Platform, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { MapView, Permissions, Location } from 'expo';
import * as firebase from 'firebase';
import getLocation from '../components/getLocation';
import getDirections from '../components/getDirections';
import ModalTest from '../components/newLocationModal';
// import { locale } from 'core-js/library/web/timers';

const imageMapView = require('../assets/userLocation.png');

const CHECKINDIST = 40;

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

const getColor = () => {
  const color = Platform.OS === 'ios' ? '#fff' : '#3a599a';
  return color;
};

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

    this.showModal = this.showModal.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.startGame = this.startGame.bind(this);
    this.getLocationAsync = this.getLocationAsync.bind(this);
    this.checkIn = this.checkIn.bind(this);
    this.getURad = this.getURad.bind(this);
    this.continueLocation = this.continueLocation.bind(this);

    this.updateVisitedList = this.updateVisitedList.bind(this);
    this.getCurrentScore = this.getCurrentScore.bind(this);
    this.getDifficulty = this.getDifficulty.bind(this);

    this.state = {
      markers: [],
      umarker,
      region: this.region,
      modalState: false,
      visitedList: [],
      coords: [],
      score: null,
      difficulty: null,
      timeDiffSeconds: 0,
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
      .on('value', (snapshot) => {
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

  getDistance() {
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

    return d;
  }

  showModal() {
    this.setState({ modalState: true });
  }

  closeModal = () => {
    this.setState({ modalState: false });
  };

  getColor() {
    const color = Platform.OS === 'ios' ? '#fff' : '#3a599a';
    return color;
  }

  getScoreToAdd() {
    if (this.state.difficulty === 'easy') {
      // return 100;
      return 100;
    } else if (this.state.difficulty === 'medium') {
      // return 100 + ((this.state.distanceToNextLocation / 1440) - this.state.timeDiffSeconds) / 10;
      return 200;
    } else if (this.state.difficulty === 'hard') {
      // return 100 + (((this.state.distanceToNextLocation / 1440) - this.state.timeDiffSeconds) / 15);
      return 300;
    }
    return 0;
  }

  getCurrentScore() {
    let score;
    if (this.state.gameID != null) {
      firebase
        .database()
        .ref(`game/${this.state.gameID}`)
        .on('value', (snapshot) => {
          score = snapshot.val().Score;
          this.setState({ score });
        });
    }
  }

  getDifficulty() {
    const user = firebase.auth().currentUser;
    firebase
      .database()
      .ref(`/user/${user.uid}`)
      .on('value', (snapshot) => {
        this.setState({ difficulty: snapshot.val().difficulty });
      });
  }

  checkIn() {
    const date = new Date();
    const d = this.getDistance();

    if (d < CHECKINDIST) {
      let timeDiff = date.getTime() - this.state.nextLocation.startTime;
      timeDiff /= 1000;

      timeDiff = parseFloat(timeDiff.toString());

      this.setState({ timeDiffSeconds: timeDiff });

      Alert.alert('WOOOOO', `You made it in ${timeDiff} seconds`);
      this.updateEndTime(date.getTime());
      this.updateVisitedList(this.state.nextLocation.placeID);
      this.setState({ nextLocation: null, coords: null });

      this.addScore();
    } else {
      Alert.alert('Nope', `You need to move ${Math.floor(d - CHECKINDIST)} meters closer`);
    }
  }

  updateEndTime(time) {
    let place;
    let places;
    firebase
      .database()
      .ref(`game/${this.state.gameID}`)
      .once('value', (snapshot) => {
        ({ places } = snapshot.val());
        const index = snapshot.val().visited;
        place = snapshot.val().places[index];
        place.endTime = time;
        places[index] = place;
      })
      .then(firebase
        .database()
        .ref(`game/${this.state.gameID}`)
        .update({
          places,
        }));
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
            if (newTest == null) {
              this.setState({ nextLocation: null, visitedList: [], coords: null });
            }
            if (newTest) {
              firebase
                .database()
                .ref(`/game/${newTest}`)
                .on('value', (snapshot) => {
                  if (snapshot.val() != null) {
                    if (snapshot.val().visited > 0) {
                      this.setState({ visitedList: snapshot.val().visitedList });
                    }
                    const place = snapshot.val().visited;
                    const newlocation = snapshot.val().places[place + 1];
                    if (newlocation != null) {
                      this.setState({ nextLocation: newlocation });
                    }
                    if (this.state.umarker != null && this.state.nextLocation != null) {
                      getDirections(
                        this.state.umarker.coordinates,
                        this.state.nextLocation.coordinates,
                      )
                        .then((coordsArray) => {
                          this.setState({ coords: coordsArray });
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                    }
                    this.getDifficulty();
                    this.getCurrentScore();
                  }
                });
            }
          }
        });
    }
  }

  continueLocation() {
    this.getURad();
    const date = new Date();
    getLocation(this.state.umarker, this.state.uRad, this.state.visitedList).then((nextLoc) => {
      if (nextLoc) {
        nextLoc.startTime = date.getTime();
        let places;
        this.setState({ nextLocation: nextLoc });
        // const user = this.state.uid;
        firebase
          .database()
          .ref(`/game/${this.state.gameID}`)
          .once('value', (snapshot) => {
            ({ places } = snapshot.val());
            places.push(nextLoc);
            firebase
              .database()
              .ref(`/game/${this.state.gameID}`)
              .update({
                places,
              });
          });
        getDirections(this.state.umarker.coordinates, this.state.nextLocation.coordinates)
          .then((coordsArray) => {
            this.setState({ coords: coordsArray });
          })
          .catch((e) => {
            console.log(e);
          });
        this.setState({ distanceToNextLocation: this.getDistance() });
      } else {
        Alert.alert(
          'No Locations Available',
          'Please move closer to the city, or extend your game difficulty',
        );
      }
    });
  }

  startGame() {
    this.getURad();
    const date = new Date();
    getLocation(this.state.umarker, this.state.uRad, this.state.visitedList).then((nextLoc) => {
      if (nextLoc) {
        nextLoc.startTime = date.getTime();
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
            places: [this.state.nextLocation],
            visitedList: [],
          });
        getDirections(this.state.umarker.coordinates, this.state.nextLocation.coordinates)
          .then((coordsArray) => {
            this.setState({ coords: coordsArray });
          })
          .catch((e) => {
            console.log(e);
          });
        this.setState({ distanceToNextLocation: parseFloat(this.getDistance()).toFixed(0) });
      } else {
        Alert.alert(
          'No Locations Available',
          'Please move closer to the city, or extend your game difficulty',
        );
        this.setState({ coords: null });
      }
    });
  }

  addScore() {
    const usersScore = this.state.score + parseInt(this.getScoreToAdd().toString(), 10);

    firebase
      .database()
      .ref(`game/${this.state.gameID}`)
      .update({
        Score: usersScore,
      });

    this.state.score = usersScore;
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

          {/* {this.state.nextLocation != null ? ( */}
          {/* <MapView.Marker */}
          {/* image={imageMapView} */}
          {/* key={this.state.nextLocation.name} */}
          {/* coordinate={this.state.nextLocation.coordinates} */}
          {/* title={this.state.nextLocation.name} */}
          {/* /> */}
          {/* ) : null} */}

          {/* <MapView.Marker
            image={require('../assets/userLocation.png')}
            key={this.state.umarker.title}
            coordinate={this.state.umarker.coordinates}
            title={this.state.umarker.title}
          /> */}
          {this.state.coords != null && this.state.nextLocation != null ? (
            <MapView.Polyline
              coordinates={this.state.coords}
              strokeWidth={3}
              strokeColor="#3a599a"
            />
          ) : null}

          {this.state.nextLocation != null ? (
            <MapView.Circle
              center={this.state.nextLocation.coordinates}
              radius={CHECKINDIST}
              fillColor="rgba(107,184,107, 0.35)"
              strokeColor="rgba(0,0,0, 0.4)"
            />
          ) : null}

          {this.state.umarker != null &&
          this.state.nextLocation == null &&
          this.state.uRad != null ? (
            <MapView.Circle
              center={this.state.umarker.coordinates}
              radius={this.state.uRad}
              fillColor="rgba(194,24,7, 0.25)"
              strokeColor="rgba(0, 0, 0, 0.2)"
            />
          ) : null}
        </MapView>
        {this.state.gameID != null ? (
          <View
            style={{
              // alignSelf: 'flex-end',
              top: 40,
              padding: 5,
              marginRight: -5,
              position: 'absolute',
              backgroundColor: '#3a599a',
              borderRadius: 5,
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 16 }}>Score: {this.state.score}</Text>
          </View>
        ) : null}

        {this.state.gameID != null ? (
          <View
            style={{
              margin: 25,
              backgroundColor: '#3a599a',
              borderRadius: 5,
              padding: 5,
            }}
          >
            {this.state.nextLocation != null && this.getDistance() <= CHECKINDIST ? (
              <React.Fragment>
                <Button title="Check In" onPress={this.checkIn} color={getColor()} />
              </React.Fragment>
            ) : null}

            {this.state.nextLocation != null && this.getDistance() > CHECKINDIST ? (
              <React.Fragment>
                <Button
                  title={`Distance Remaining: \n${Math.round(this.getDistance())} m`}
                  onPress={() => {}}
                  color={getColor()}
                />
              </React.Fragment>
            ) : null}

            {this.state.nextLocation == null ? (
              <Button title="Continue" onPress={this.continueLocation} color={getColor()} />
            ) : null}
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
            <Button title="Start Game" onPress={this.startGame} color={getColor()} />
          </View>
        )}
        {this.state.gameID != null ? (
          <View style={{ position: 'absolute', right: '2%', bottom: 16 }}>
            {this.state.nextLocation != null ? (
              <Icon raised reverse name="directions-run" color="#3a599a" onPress={this.showModal} />
            ) : null}
          </View>
        ) : (
          <Text />
        )}
        <ModalTest
          closeModal={this.closeModal}
          showState={this.state.modalState}
          modalData={this.state.nextLocation}
        />
      </View>
    );
  }
}
