import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class App extends Component {
  constructor() {
    super();
    this.state = {};
    this.getGameData = this.getGameData.bind(this);
    this.createList = this.createList.bind(this);
  }

  componentDidMount() {
    // Firebase get shit
    const firebaseConfig = {
      apiKey: 'AIzaSyB2ZZEFkIIFeW_un8kSkaEocEgaDGMuxIU',
      authDomain: 'pinpointit-393d2.firebaseapp.com',
      databaseURL: 'https://pinpointit-393d2.firebaseio.com/',
      storageBucket: 'pinpointit-393d2.appspot.com',
    };
    firebase.initializeApp(firebaseConfig);
    this.getGameData();

    let urlParams;
    (window.onpopstate = function () {
      let match,
        pl = /\+/g, // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
          return decodeURIComponent(s.replace(pl, ' '));
        },
        query = window.location.search.substring(1);

      urlParams = {};
      while ((match = search.exec(query))) urlParams[decode(match[1])] = decode(match[2]);
    })();
    this.getGameData(urlParams.gameID);
  }

  getGameData(gameID) {
    firebase
      .database()
      .ref(`game/${gameID}`)
      .on('value', (snapshot) => {
        if (snapshot.val()) {
          this.setState({ places: snapshot.val().places, score: snapshot.val().Score });
        }
      });
  }

  createList() {
    if (this.state.places == null) {
      return null;
    }
    return this.state.places.map((l) => {
      console.log(l);
      const sdate = new Date(l.startTime);
      let edate;
      if (l.endTime) {
        edate = new Date(l.endTime);
      }
      return (
        <Card style={{ width: 350, margin: 30 }}>
          <CardMedia overlay={<CardTitle title={l.name} />}>
            <img
              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=AIzaSyB4oIF2s36OGPr_LugqibsU7fIuQ1kpjfk&photoreference=${
                l.image
              }`}
              alt=""
            />
          </CardMedia>
          <CardTitle title="Start Time" subtitle={sdate.toLocaleTimeString()} />
          {l.endTime ? <CardTitle title="End Time" subtitle={edate.toLocaleTimeString()} /> : null}
        </Card>
      );
    });
    // return (
    //   <List containerStyle={styles.list}>
    //     {this.state.places.map((l) => {
    //       const sdate = new Date(l.startTime);
    //       let edate;
    //       if (l.endTime) {
    //         edate = new Date(l.endTime);
    //       }
    //       return (
    //         <Card key={l.name} title={l.name} wrapperStyle={styles.card}>
    //           <Text>Start Time: {sdate.toLocaleTimeString()}</Text>
    //           {l.endTime ? <Text>End Time: {edate.toLocaleTimeString()}</Text> : null}
    //           <Image
    //             source={{
    //               uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=AIzaSyB4oIF2s36OGPr_LugqibsU7fIuQ1kpjfk&photoreference=${
    //                 l.image
    //               }`,
    //             }}
    //             style={styles.image}
    //           />
    //         </Card>
    //       );
    //     })}
    //   </List>
    // );
  }

  render() {
    const muiTheme = getMuiTheme({
      appBar: {
        color: '#3949AB',
      },
    });
    const score = `Score: ${this.state.score}`;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <AppBar title={score} iconClassNameRight="muidocs-icon-navigation-expand-more" />
          <center>{this.createList()}</center>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
