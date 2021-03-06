import React, { Component }  from 'react';
import './App.css';
import firebase from './firebase-config';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Routes from './components/Routes';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import classNames from 'classnames';

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
    secondary: blueGrey,
  },

  status: {
    danger: 'orange',
  }
});



class App extends Component {
  state = {
    recipe: [],
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
          console.log(Object.assign({}, doc.data(), {"doc_id": doc.id}));

          // We want to save the document ID as well, so save it with the rest of the data fields
          data.push(Object.assign({}, doc.data(), {"doc_id": doc.id}));
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

    try {
        db.collection('recipe').get().then(snapshot => {
          var data = [];
          if (snapshot.empty) {
            console.log('no data');
            return
          }
          snapshot.forEach(doc => {
            console.log(Object.assign({}, doc.data(), {"doc_id": doc.id}));

             // We want to save the document ID as well, so save it with the rest of the data fields
          data.push(Object.assign({}, doc.data(), {"doc_id": doc.id}));
        })
        this.setState({
          recipe: data
        })
      })
    } catch (error) {
      this.setState({
        error
      })
    }
  }

  // An item has been added/removed to the database, so update inventory state to represent the new collection
  handleInventoryItemsChanged = () => {
    try {
      db.collection('inventory').get().then(snapshot => {
        var data = [];
        if (snapshot.empty) {
          console.log('no data');
          return
        }
        snapshot.forEach(doc => {
          console.log(Object.assign({}, doc.data(), {"doc_id": doc.id}));

          // We want to save the document ID as well, so save it with the rest of the data fields
          data.push(Object.assign({}, doc.data(), {"doc_id": doc.id}));
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

  // This function removes an item from the database.
  handleRemoveItem(targetItemName, targetDocID) {
    // Remove this item from the database
    db.collection('inventory').doc(targetDocID).delete().then(function() {
      console.log("Successfully deleted item " + targetItemName + " from inventory");
    }).catch(function(error) {
      alert("error removing document: " + error);
    })
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <NavBar />
          <Routes 

            recipeState={this.state.recipe}
            inventoryState={this.state}
            handleRemoveItem={this.handleRemoveItem} 
            handleInventoryItemsChanged={this.handleInventoryItemsChanged}/>

          <Footer />
        </div>
      </MuiThemeProvider>
    );

  }

}

export default App;
