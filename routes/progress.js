import React from 'react';
import { StyleSheet, Text, View, Button, Platform, Image, ScrollView } from 'react-native';
import { Card, List } from 'react-native-elements';
import * as firebase from 'firebase';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    justifyContent: 'center',
    width: 200,
    height: 200,
    margin: 10,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginTop: 30,
    marginBottom: 100,
    width: '100%',
    backgroundColor: 'white',
  },
  endButton: {
    marginBottom: 10,
    backgroundColor: '#3a599a',
    borderRadius: 5,
    padding: 5,
  },
  scroll: {
    marginBottom: 0,
    width: '100%',
  },
  score: {
    fontSize: 16,
    margin: 30,
    color: '#FFFFFF',
    padding: 5,
    backgroundColor: '#3a599a',
    borderRadius: 5,
  },
  startGame: { fontSize: 16, margin: 80 },
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
    return (
      <List containerStyle={styles.list}>
        {this.state.places.map((l) => {
          const sdate = new Date(l.startTime);
          let edate;
          if (l.endTime) {
            edate = new Date(l.endTime);
          }
          return (
            <Card key={l.name} title={l.name} wrapperStyle={styles.card}>
              <Text>Start Time: {sdate.toLocaleTimeString()}</Text>
              {l.endTime ? <Text>End Time: {edate.toLocaleTimeString()}</Text> : null}
              <Image
                source={{
                  uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=AIzaSyB4oIF2s36OGPr_LugqibsU7fIuQ1kpjfk&photoreference=${
                    l.image
                  }`,
                }}
                style={styles.image}
              />
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
          <View style={styles.score}>
            <Text style={{ color: '#FFFFFF' }}>Score: {this.state.currentScore}</Text>
          </View>
        ) : (
          <Text style={styles.startGame}>Start a game to access progress</Text>
        )}
        {this.state.gameID != null ? (
          <View style={styles.endButton}>
            <Button title="End Game" onPress={this.endGame} color={getColor()} />
          </View>
        ) : null}
        <ScrollView style={styles.scroll}>
          {this.state.places != null ? this.createList() : null}
        </ScrollView>
      </View>
    );
  }
}
