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
    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    this.setState({ signedIn: false });
    firebase.auth().signOut().then(function () {
      console.log("SignedOut");
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Game Progress here</Text>
        <Button title="Log Out" onPress={this.logOut} />
      </View>
    );

  }
}
