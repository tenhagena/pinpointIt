import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SocialIcon } from 'react-native-elements';


import loginFacebook from '../components/loginHelper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
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
          <View style={styles.container}>
            <Image source={require('../assets/icon.png')} />
            <Text style={{
                        fontSize: 22,
                        paddingTop: 20,
                    }}
            >Welcome to PinpointIt!
            </Text>
          </View>
          <View style={styles.container}>
            <SocialIcon
              title="Sign In with Facebook"
              button
              type="facebook"
              onPress={loginFacebook}
              raised
              style={{ width: 250, height: 50 }}
            />
          </View>
        </View>
      );
    }
}
