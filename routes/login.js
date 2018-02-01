import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import loginFacebook from '../components/loginHelper';

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
