import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Button, SocialIcon } from 'react-native-elements';

import loginFacebook from '../components/loginHelper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  login: {
    marginTop: 100,
  },
});
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/icon.png')} />
        <Text
          style={{
            fontSize: 22,
            paddingTop: 20,
          }}
        >
          Welcome to PinpointIt!
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
