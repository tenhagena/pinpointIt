import React from 'react';
import * as firebase from 'firebase';
import { StackNavigator } from 'react-navigation';

import Login from './routes/login';
import GameMap from './routes/gameMap';

/**
 * Test function to store highscore
 */
function storeHighScore(user, score) {
  if (user != null) {
    firebase
      .database()
      .ref(`user/${user.uid}`)
      .set({
        highScore: score,
      });
  }
}
const SimpleApp = StackNavigator({
  Home: { screen: Login },
  GameMap: { screen: GameMap },
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
  }

  componentDidMount() {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: 'AIzaSyB2ZZEFkIIFeW_un8kSkaEocEgaDGMuxIU',
      authDomain: 'pinpointit-393d2.firebaseapp.com',
      databaseURL: 'https://pinpointit-393d2.firebaseio.com/',
      storageBucket: 'pinpointit-393d2.appspot.com',
    };

    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log('We are authenticated now!');
        storeHighScore(firebase.auth.currentUser);
        // Redirect to new page
        this.setState({ loggedIn: true });
      }
    });
  }
  render() {
    if (this.state.loggedIn === true) return <GameMap />;
    return <SimpleApp />;
  }
}
