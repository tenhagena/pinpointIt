import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, SocialIcon } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import loginFacebook from '../components/loginHelper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#517eab',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/logo2.png')} />
        <Button
          icon={<FontAwesome name="facebook-official" size={35} color="white" />}
          onPress={loginFacebook}
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
