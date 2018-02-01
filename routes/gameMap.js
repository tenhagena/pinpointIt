import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
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

export default class GameMap extends React.Component {
  static navigationOptions = {
    title: 'Chat with Lucy',
    headerTintColor: 'blue',
  };
  constructor(props) {
    super(props);
    this.state = { markers: [] };
    this.getLocations = this.getLocations.bind(this);
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
          initialRegion={{
            latitude: 42.3361,
            longitude: -71.0954,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
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
      </View>
    );
  }
}
