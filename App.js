import React from 'react';
// import { AsyncStorage, Alert } from 'react-native';
import * as firebase from 'firebase';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';

// Our main screens (routes)
import Login from './routes/login';
import GameMap from './routes/gameMap';
import Progress from './routes/progress';

/** ROUTES (maybe move to new file instead of keeping them here in the entrypoint?) */
// Component: createRootNavigator - will determine if we're currently signed in or signed out
// Route: SignedIn
// Route: SignedOut

// Component: SignedOut
// Route: Login - The login page
const SignedOut = StackNavigator({
  Login: { screen: Login },
});

/* Per style guidelines, we're going to want to use a TabNavigator on iOS,
** and a DrawerNavigator on Android -- EDIT: maybe not
*/

/*
const determineNavType = (props) => {
  if (Platform.OS === 'ios') {
    return TabNavigator(props);
  } else if (Platform.OS === 'android') return TabNavigator(props);
  return null;
}; */

// Component: SignedIn
// Route: GameMap - The game map
// Route: TBD
// Route: TBD
const SignedIn = TabNavigator(
  {
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
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
  },
);

/** End Routes */

/**
 * Test function to store highscore
 */
const checkUser = (user) => {
  if (user != null) {
    return firebase
      .database()
      .ref(`/user/${user.uid}`)
      .once('value', (snapshot) => {
        const exists = snapshot.val() !== null;
        if (!exists) {
          firebase
            .database()
            .ref(`/user/${user.uid}`)
            .update({
              HighScore: 0,
            });
        }
      });
  }
  return null;
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { signedIn: false };
  }

  componentDidMount() {
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: 'AIzaSyB2ZZEFkIIFeW_un8kSkaEocEgaDGMuxIU',
      authDomain: 'pinpointit-393d2.firebaseapp.com',
      databaseURL: 'https://pinpointit-393d2.firebaseio.com/',
      storageBucket: 'pinpointit-393d2.appspot.com',
    };

    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // console.log(`Current user is ${firebase.auth.currentUser}`);
        checkUser(user).then(this.setState({ signedIn: true }));
        // Redirect to new page
      } else {
        this.setState({ signedIn: false });
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
