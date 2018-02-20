import React from 'react';
import { AsyncStorage, Platform } from 'react-native';
import * as firebase from 'firebase';
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';

// Our main screens (routes)
import Login from './routes/login';
import GameMap from './routes/gameMap';
import Progress from './routes/progress';

/**
 * Test function to store highscore
 */
function storeHighScore(user, score) {
  if (user != null) {
    firebase
      .database()
      .ref(`user/${user.uid}`)
      .set({
        highScore: score,
      });
  }
}

/** ROUTES (maybe move to new file instead of keeping them here in the entrypoint?) */
// Component: createRootNavigator - will determine if we're currently signed in or signed out
// Route: SignedIn
// Route: SignedOut

// STATUS - not currently being used
export const createRootNavigator = (signedIn = false) =>
  StackNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
      SignedOut: {
        screen: SignedOut,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
    },
    {
      headerMode: 'none',
      mode: 'modal',
      initialRouteName: signedIn ? 'SignedIn' : 'SignedOut',
    },
  );

// Component: SignedOut
// Route: Login - The login page
const SignedOut = StackNavigator({
  Login: { screen: Login },
});

/* Per style guidelines, we're going to want to use a TabNavigator on iOS,
** and a DrawerNavigator on Android
*/
const determineNavType = (props) => {
  if (Platform.OS === 'ios') {
    return TabNavigator(props);
  } else if (Platform.OS === 'android') return DrawerNavigator(props);
  return null;
};

// Component: SignedIn
// Route: GameMap - The game map
// Route: TBD
// Route: TBD
const SignedIn = determineNavType({
  GameMap: {
    screen: GameMap,
    navigationOptions: {
      tabBarLabel: 'Map',
    },
  },
  Progress: {
    screen: Progress,
    navigationOptions: {
      tabBarLabel: 'Progress',
    },
  },
});

/** End Routes */

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { signedIn: false };
  }

  componentWillMount() {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: 'AIzaSyB2ZZEFkIIFeW_un8kSkaEocEgaDGMuxIU',
      authDomain: 'pinpointit-393d2.firebaseapp.com',
      databaseURL: 'https://pinpointit-393d2.firebaseio.com/',
      storageBucket: 'pinpointit-393d2.appspot.com',
    };

    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        // console.log('We are authenticated now!');
        storeHighScore(firebase.auth.currentUser);
        // Redirect to new page
        this.setState({ signedIn: true });
      }
    });
  }
  render() {
    const { signedIn } = this.state;
    if (signedIn === true) {
      return <SignedIn />;
    }
    return <SignedOut />;
  }
}
