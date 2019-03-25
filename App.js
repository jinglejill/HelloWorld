/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Image} from 'react-native';
import {createStackNavigator,createAppContainer,HeaderBackButton} from 'react-navigation';
import {getMaster} from './services/FetchMaster';
import { Button } from 'react-native-elements';
import {getLogIn} from './services/LogIn.js';
import LogInScreen from './screens/LogInScreen.js';
import MessageBox from './screens/MessageBox.js';
import MenuScreen from './screens/MenuScreen.js';
import MenuOnOffScreen from './screens/MenuOnOffScreen.js';
import MenuDetailScreen from './screens/MenuDetailScreen.js';
import SpecialPriceSettingScreen from './screens/SpecialPriceSettingScreen.js';
import BranchSettingScreen from './screens/BranchSettingScreen.js';
import TestScreen from './screens/TestScreen.js';

class LaunchScreen extends Component
{
  saveDetails = () => {
      console.log('aaaa');
  }

  componentDidMount()
  {
    return fetch('https://jummum.co/app/dev_jor/JORMasterGet.php')
      .then((response) => response.json())
      .then(this.props.navigation.navigate('LogInScreenKey'))
      .catch((error) =>{
        console.error(error);
      });
  }
  render() {
    return (
      // <View style={styles.root}>
      <View style={styles.greenBackground} >
        <View style={styles.centerInContainer} >
         <Image
           source={require("./assets/images/jummumLogoWithType.png")}
           style={styles.jummumImage}
         />
       </View>
       <View style={{alignContent: 'center'}}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.welcome}></Text>
        <Text style={styles.welcomeDetail}>
          Customize menu, promotion and reward to let your customers get the
          most impressive experience
        </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  greenBackground: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    // alignSelf: 'stretch',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(99,219,199,1)",
    opacity: 1,
  },
  centerInContainer: {
    alignItems: 'center',
  },
  jummumImage: {
    height:300,
    width:246,
  },
  welcome: {
    backgroundColor: "transparent",
    fontFamily: "Prompt-SemiBold",
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  welcomeDetail: {
    backgroundColor: "transparent",
    fontFamily: "Prompt-Regular",
    fontSize: 15,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  headerRightButton: {
    backgroundColor: "transparent",
  },
});

const navigationOptions = ({ navigation }) => ({
    headerRight: navigation.state.params.showNewButton?<Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"New"} onPress={navigation.state.params.handleNewMenu} />:"",
    headerLeft: <HeaderBackButton tintColor="#FFFFFF" onPress={() => navigation.goBack(null)} />,
    title: 'เมนู',
    headerTintColor: '#ffffff',
    headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
    headerTitleStyle: {
          fontFamily: "Prompt-SemiBold",
          fontSize: 18,
        },
    swipeEnabled: false,
    animationEnabled:false,
});
const AppNavigator = createStackNavigator({

  LaunchScreen: {
    screen: LaunchScreen,
    navigationOptions: {
    headerStyle: {display:"none"},
    headerLeft: null
    }
  },
  LogInScreenKey: {
    screen: LogInScreen,
    navigationOptions: {
    headerStyle: {display:"none"},
    headerLeft: null
    }
  },
  MenuScreen: {
    screen: MenuScreen,
    navigationOptions: {
      headerStyle: {display:"none"},
      headerLeft: null
    }
  },
  MenuOnOffScreen: {
    screen: MenuOnOffScreen,
    navigationOptions
  },
  MenuDetailScreen: {
    screen: MenuDetailScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'รายละเอียดเมนู',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.state.params.onGoBack();
            navigation.goBack(null);}} />,
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"Save"} onPress={navigation.state.params.handleSave} />
      })
  },
  SpecialPriceSettingScreen: {
    screen: SpecialPriceSettingScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'ตั้งค่าส่วนลด',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.goBack(null);}} />,
        headerRight: <Button buttonStyle={styles.headerRightButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} title={"Save"} onPress={navigation.state.params.handleSave} />
      })
  },
  BranchSettingScreen: {
    screen: BranchSettingScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'ตั้งค่าร้านอาหาร',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.goBack(null);}}
          />,
        headerRight: <Button buttonStyle={styles.headerRightButton}
          titleStyle={{fontFamily: "Prompt-SemiBold"}}
          title={"Save"}
          onPress={navigation.state.params.handleSave} />
      })
  },
  TestScreen: {
    screen: TestScreen,
    navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        title: 'ตั้งค่าร้านอาหาร',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor: 'rgba(99,219,199,1)',display:"flex"},
        headerTitleStyle: {
              fontFamily: "Prompt-SemiBold",
              fontSize: 18,
            },
        headerLeft: <HeaderBackButton tintColor="#FFFFFF"
          onPress={() => {
            navigation.goBack(null);}}
          />,
        headerRight: <Button buttonStyle={styles.headerRightButton}
          titleStyle={{fontFamily: "Prompt-SemiBold"}}
          title={"Save"}
          onPress={navigation.state.params.handleSave} />
      })
  },
  MessageBox: {
    screen: MessageBox,
    navigationOptions: {
    headerStyle: {display:"none"},
    headerLeft: null
    }
  }
});

export default createAppContainer(AppNavigator)
{

};
