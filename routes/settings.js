import React from 'react';
import { Picker, StyleSheet, Text, View, Button } from 'react-native';
import { Divider, Slider } from 'react-native-elements';
import * as firebase from 'firebase';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 20,
    marginTop: '20%',
    marginBottom: 30,
  },
  radiusHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  difficultyHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 100,
  },
});

export default class Settings extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  componentWillMount() {
    const user = firebase.auth().currentUser;

    firebase
      .database()
      .ref(`/user/${user.uid}`)
      .once('value')
      .then((snapshot) => {
        this.setState({ uRad: snapshot.val().uRad, difficulty: snapshot.val().difficulty });
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      minRadius: 500,
      maxRadius: 2000,
      uRad: 1000,
      difficulty: 'easy',
    };
  }

  updateRadius(value) {
    const user = firebase.auth().currentUser;

    firebase
      .database()
      .ref(`user/${user.uid}`)
      .update({
        uRad: value,
      });
  }

  updateDifficulty(value) {
    const user = firebase.auth().currentUser;

    firebase
      .database()
      .ref(`user/${user.uid}`)
      .update({
        difficulty: value,
      });
  }

  logOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('SignedOut');
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.radiusHeader}>
            How far are you willing to walk to the next location?
          </Text>
          <Slider
            value={this.state.uRad}
            onSlidingComplete={(uRad) => {
              this.updateRadius(uRad);
            }}
            onValueChange={uRad => this.setState({ uRad })}
            minValue={this.state.minRadius}
            maximumValue={this.state.maxRadius}
            step={10}
            thumbTintColor="#3B5998"
          />
          <Text
            style={{
              fontSize: 16,
            }}
          >
            Radius: {this.state.uRad} m
          </Text>
        </View>
        <Divider />
        <View
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
            flex: 2,
          }}
        >
          <Text style={styles.difficultyHeader}>Difficulty</Text>
        </View>
        <View>
          <Picker
            selectedValue={this.state.difficulty}
            onValueChange={(itemValue) => {
              // switch (itemValue) {
              //     case 'easy':
              //         this.state.minRadius = 500;
              //         this.state.maxRadius = 2000;
              //         break;
              //     case 'medium':
              //         this.state.minRadius = 1000;
              //         this.state.maxRadius = 3500;
              //         break;
              //     case 'hard':
              //         this.state.minRadius = 2000;
              //         this.state.maxRadius = 5000;
              //         break;
              //     default:
              //         break;
              // }
              this.updateDifficulty(itemValue);
              this.setState({ difficulty: itemValue });
            }}
          >
            <Picker.Item label="Easy" value="easy" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="Hard" value="hard" />
          </Picker>
        </View>
        <View
          style={{
            margin: 25,
            backgroundColor: '#3a599a',
            borderRadius: 5,
            padding: 5,
          }}
        >
          <Button title="Log Out" onPress={this.logOut} color="#fff" />
        </View>
      </View>
    );
  }
}
