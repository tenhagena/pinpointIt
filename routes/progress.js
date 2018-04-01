import React from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import { Card, List, ListItem } from 'react-native-elements';
import * as firebase from 'firebase';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };

  constructor(props) {
    super(props);
    this.state = { signedIn: true, visitedList: null, placesList: null };
    this.endGame = this.endGame.bind(this);
    this.getGameID = this.getGameID.bind(this);
    this.getGame = this.getGame.bind(this);
    this.getPlace = this.getPlace.bind(this);
  }

  componentDidMount() {
    this.getGameID();
  }

  getColor() {
    const color = Platform.OS === 'ios' ? '#fff' : '#3a599a';
    return color;
  }

  getGame() {
    firebase
      .database()
      .ref(`game/${this.state.gameID}`)
      .once('value', (snapshot) => {
        if (snapshot.child('visitedList').exists()) {
          const visitedList = snapshot.val().visitedList;
          this.setState({ visitedList });
        }
        const currentScore = snapshot.val().Score;
        this.setState({ currentScore });
      })
      .then(() => {
        this.getPlaces();
      });
  }

  async getPlace(placeID) {
    let object = { real: 'blah' };

    await firebase
      .database()
      .ref(`places/${placeID}`)
      .once('value', (snapshot) => {
        object = { name: snapshot.val().name, image: snapshot.val().image };
        return object;
      })
      .then(object => object);
    return object;
  }

  getPlaces() {
    const placesList = [];
    for (const i in this.state.visitedList) {
      this.getPlace(this.state.visitedList[i]).then((object) => {
        placesList.push(object);
        console.log(object);
        this.setState({ placesList });
      });
    }
  }

  getGameID() {
    const user = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/user/${user}`)
      .once('value', (snapshot) => {
        if (snapshot.val() != null) {
          const newTest = snapshot.val().game;
          this.setState({ gameID: newTest });
        }
      })
      .then(() => this.getGame());
  }

  endGame() {
    const user = firebase.auth().currentUser;
    firebase
      .database()
      .ref(`user/${user.uid}`)
      .update({
        game: null,
      });
    this.setState({ gameID: null });
  }

  createList() {
    if (this.state.placesList == null || this.state.placesList === undefined) {
      return null;
    }
    console.log(this.state.placesList);
    return (
      <List containerStyle={{ marginBottom: 20, marginTop: 30 }}>
        {this.state.placesList.map((l, i) => <Card key={i} title={l.name} />)}
      </List>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.visitedList != null && this.state.placesList != null ? this.createList() : null}
        {this.state.gameID != null ? (
          <View
            style={{
              margin: 25,
              backgroundColor: '#3a599a',
              borderRadius: 5,
              padding: 5,
            }}
          >
            <Button title="End Game" onPress={this.endGame} color={this.getColor()} />
          </View>
        ) : (
          <Text />
        )}
      </View>
    );
  }
}
