import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as firebase from 'firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    this.state = { signedIn: true };
    this.getGame();
    this.endGame = this.endGame.bind(this);
    this.getGame = this.getGame.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  getGame() {
    const user = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/user/${user}`)
      .on('value', (snapshot) => {
        if (snapshot.val() != null) {
          const newTest = snapshot.val().game;
          this.setState({ gameID: newTest });
        }
      });
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
  logOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('SignedOut');
      });
    this.setState({ signedIn: false });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Game Progress here</Text>
        {this.state.signedIn === true ? <Button title="Log Out" onPress={this.logOut} /> : <Text />}
        {this.state.gameID != null ? <Button title="End Game" onPress={this.endGame} /> : <Text />}
      </View>
    );
  }
}
