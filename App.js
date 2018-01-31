import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as firebase from 'firebase';
import loginFacebook from './components/login';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function storeHighScore(user, score) {
  if (user != null) {
    firebase
      .database()
      .ref(`user/${user.uid}`)
      .set({
        highscore: score,
      });
  }
}

export default class App extends React.Component {
  componentDidMount() {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: 'AIzaSyB2ZZEFkIIFeW_un8kSkaEocEgaDGMuxIU',
      authDomain: 'pinpointit-393d2.firebaseapp.com',
      databaseURL: 'https://pinpointit-393d2.firebaseio.com/',
      storageBucket: 'pinpointit-393d2.appspot.com',
    };

    firebase.initializeApp(firebaseConfig);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to PinpointIt</Text>
        <Button
          onPress={loginFacebook}
          title="Login with FaceBook"
          color="#4286f4"
          accessibilityLabel="Learn more about this blue button"
        />
      </View>
    );
  }
}
