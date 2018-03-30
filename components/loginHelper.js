import * as firebase from 'firebase';
import Expo from 'expo';
import { Alert } from 'react-native';

export default async function loginWithFacebook() {
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1416792931777351', {
    permissions: ['public_profile', 'user_birthday', 'email'],
  });

  if (type === 'success') {
    // Build Firebase credential with the Facebook access token.
    const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    const jsondata = await response.json();
    Alert.alert('Logged in!', `Hi ${jsondata.name}! You will now be taken to the game.`);
    const credential = firebase.auth.FacebookAuthProvider.credential(token);

    // Sign in with credential from the Facebook user.
    firebase.auth().signInWithCredential(credential);
    /* .catch((error) => {
        console.log(error);
      }); */
  }
}
