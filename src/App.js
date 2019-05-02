import React, { Component }  from 'react';
import './App.css';
import firebase from './firebase-config';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Routes from './components/Routes';
import green from '@material-ui/core/colors/green';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// I'm not exactly sure how the theme works, but these colors should look OK?
const db = firebase.firestore();
const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main
      main: '#7a99c2',


      // dark: will be calculated from palette.primary.main
      dark: '#273951',

      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: '#FFFFFF'
    },
    secondary: green,
  },

  status: {
    danger: 'orange',
  }
});

class App extends Component {
  state = {
    inventory: [],
  }

  // Load the current inventory from the database
  async componentDidMount() {
    try {
      db.collection('inventory').get().then(snapshot => {
        var data = [];
        if (snapshot.empty) {
          console.log('no data');
          return
        }
        snapshot.forEach(doc => {
          data.push(doc.data());
        })
        this.setState({
          inventory: data
        })
      })
    } catch (error) {
      this.setState({
        error
      })
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <NavBar />
          <Routes inventoryState={this.state}/>
          <Footer />
        </div>
      </MuiThemeProvider>
    );

  }

}

export default App;
