import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Image, Dimensions} from 'react-native';

class App extends Component {
  render() {
    const greeting = 'abc Welcome to React';
    const win = Dimensions.get('window');
    return (
      // <div>
        <Greeting greeting={win.width}/>
      // </div>
    );
  }
}

class Greeting extends Component {
  render() {


    return (<Text>{this.props.greeting}</Text>
    );
  }
}

export default App;
