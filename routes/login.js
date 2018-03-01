import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Button, SocialIcon, Avatar } from 'react-native-elements';

import loginFacebook from '../components/loginHelper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c9cbd0',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  login: {
    marginTop: 100,
  },
  title: {
    marginTop: 60,
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatar: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#3a599a',
  },
});
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/avatar.png')}
          style={styles.avatar}
          resizeMode="stretch"
        />
        <Text style={styles.title} text>
          Welcome to PinPointIt
        </Text>

        <Button
          icon={<FontAwesome name="facebook-official" size={35} color="white" />}
          onPress={loginFacebook}
          style={styles.login}
          buttonStyle={{
            backgroundColor: '#3a599a',
            width: 250,
            height: 60,
          }}
          text="Login with FaceBook"
        />
      </View>
    );
  }
}
