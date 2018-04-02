import React from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import { Card, List } from 'react-native-elements';
import * as firebase from 'firebase';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const getColor = () => {
  const color = Platform.OS === 'ios' ? '#fff' : '#3a599a';
  return color;
};

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };

  constructor(props) {
    super(props);
    this.state = { visitedList: null, placesList: null };
    this.endGame = this.endGame.bind(this);
    this.getGameID = this.getGameID.bind(this);
  }

  componentDidMount() {
    this.getGameID();
  }

  getGameID() {
    const user = firebase.auth().currentUser.uid;
    let newTest;
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
                    this.setState({
                      currentScore: snapshot.val().Score,
                      places: snapshot.val().places,
                    });
                  }
                });
            }
          }
        });
    }
  }

  endGame() {
    const user = firebase.auth().currentUser;
    firebase
      .database()
      .ref(`user/${user.uid}`)
      .update({
        game: null,
      });
    this.setState({ gameID: null, places: null });
  }

  createList() {
    if (this.state.places == null) {
      return null;
    }
    console.log(this.state.places[0]);
    return (
      <List containerStyle={{ marginBottom: 20, marginTop: 30 }}>
        {this.state.places.map((l) => {
          const sdate = new Date(l.startTime);
          let edate;
          if (l.endTime) {
            edate = new Date(l.endTime);
          }
          return (
            <Card key={l.name} title={l.name}>
              <Text>Start Time: {sdate.toLocaleTimeString()}</Text>
              {l.endTime ? <Text>End Time: {edate.toLocaleTimeString()}</Text> : null}
            </Card>
          );
        })}
      </List>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.gameID != null ? (
          <Text style={{ fontSize: 16, marginTop: 80 }}>Score: {this.state.currentScore}</Text>
        ) : (
          <Text style={{ fontSize: 16, marginTop: 80 }}>Start a game to access progress</Text>
        )}
        {this.state.places != null ? this.createList() : null}
        {this.state.gameID != null ? (
          <View
            style={{
              margin: 25,
              backgroundColor: '#3a599a',
              borderRadius: 5,
              padding: 5,
            }}
          >
            <Button title="End Game" onPress={this.endGame} color={getColor()} />
          </View>
        ) : (
          <Text />
        )}
      </View>
    );
  }
}
