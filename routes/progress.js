import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { List, ListItem } from 'react-native-elements';
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
    this.state = { signedIn: true };
    this.endGame = this.endGame.bind(this);
    this.getGame = this.getGame.bind(this);
  }

  componentDidMount() {
    this.getGame();
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

  render() {
    const list = [
      {
        name: 'Amy Farha',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Vice President',
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Vice Chairman',
      },
    ];

    return (
      <View style={styles.container}>
        <List containerStyle={{ marginBottom: 20, marginTop: 30 }}>
          {list.map((l, i) => (
            <ListItem roundAvatar avatar={{ uri: l.avatar_url }} key={i} title={l.name} />
          ))}
        </List>
        {this.state.gameID != null ? (
          <View
            style={{
              margin: 25,
              backgroundColor: '#3a599a',
              borderRadius: 5,
              padding: 5,
            }}
          >
            <Button title="End Game" onPress={this.endGame} color="#fff" />
          </View>
        ) : (
          <Text />
        )}
      </View>
    );
  }
}
