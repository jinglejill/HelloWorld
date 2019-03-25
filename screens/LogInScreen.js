import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Image, Dimensions} from 'react-native';
import { Button } from 'react-native-elements';
import DefaultPreference from 'react-native-default-preference';
import {getLogIn} from './../services/LogIn.js';
import MessageBox from './../screens/MessageBox.js';
import MenuScreen from './../screens/MenuScreen.js';
import Spinner from 'react-native-spinkit';


export class LogInScreen extends Component
{
  constructor(props) {
    super(props);

    this.state = { username: '',
                   password: '',
                   rememberMe: '◻︎ จำฉันไว้ในระบบ',
                   display: false,
                   message: '',
                   messageTitle: '',
                   showSpinner: false,
              };

    DefaultPreference.get('username').then(function(value)
    {
      if(!value)
      {
        console.log('username is null');
      }
      else if(value != "")
      {
        console.log('username:' + value);
        this.setState({username: value});
      }
    }.bind(this));

    DefaultPreference.get('password').then(function(value)
    {
      if(!value)
      {
        console.log('password is null');
      }
      else if(value != "")
      {
        console.log('password:' + value);
        this.setState({password: value});
      }
    }.bind(this));

    DefaultPreference.get('rememberMe').then(function(value)
    {
      if(!value)
      {
      }
      else if(value != "")
      {
        this.setState({rememberMe: value});
        this.logIn();
      }
    }.bind(this));
  }

  logIn = () =>
  {
    this.setState({showSpinner:true});
    //เรียก api LogIn
    fetch('https://jummum.co/app/dev_jor/JORLogIn.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        password: this.state.password,
        username:this.state.username,
        model:'',
      })
    })
    .then((response) => response.json())
    .then((responseData) =>
    {
      this.setState({showSpinner:false});
       if(responseData.success == false)
       {
         console.log("log in fail");
         this.triggerModal(responseData.error);
       }
       else
       {
         console.log(responseData);



          if(this.state.rememberMe === "◻︎ จำฉันไว้ในระบบ")
          {
            DefaultPreference.set('username', "");
            DefaultPreference.set('password', "");
            DefaultPreference.set('rememberMe', "◻︎ จำฉันไว้ในระบบ");
          }
          else
          {
            DefaultPreference.set('username', this.state.username);
            DefaultPreference.set('password', this.state.password);

            DefaultPreference.set('rememberMe', this.state.rememberMe).then(
              function()
              {
                console.log('remember me default reference done')
              }
            );
          }
          console.log("log in success");
          this.props.navigation.setParams({ username: responseData.data.UserAccount.Username });

          //go to MenuScreen
          this.props.navigation.navigate('MenuScreen',
            {'branchID': responseData.data.UserAccount.BranchID,
            'username': responseData.data.UserAccount.Username,
            onGoBack:()=>this.clearPassword()
          })
       }
     }).done();
  }

  clearPassword = () =>
  {
    DefaultPreference.get('rememberMe').then(function(value)
    {
      if(value != "")
      {
        if(value == '◻︎ จำฉันไว้ในระบบ')
        {
          this.setState({username:''});
          this.setState({password:''});
        }
        else
        {
          this.setState({password:''});
        }        
      }
    }.bind(this));


    this.setState({password:''});
  }
  rememberMe = () => {
    let consRememberMe = '◼︎ จำฉันไว้ในระบบ';
    if(this.state.rememberMe === "◻︎ จำฉันไว้ในระบบ")
    {
      consRememberMe = "◼︎ จำฉันไว้ในระบบ";
    }
    else
    {
      consRememberMe = "◻︎ จำฉันไว้ในระบบ";
    }
    this.setState({
      rememberMe: consRememberMe
    })
  }

  forgotPassword = () =>
  {
    console.log("forgotPassword");
  }

  triggerModal = (message) =>
  {
    this.setState({
      display: true,
      message: message
    })
  }

  onClose = () =>
  {
    this.setState({
      display: false,
    })
  }

  render() {
    const win = Dimensions.get('window');
    const imageHeight = 246/299*win.width;
    const tenPercentHeight = win.height*0.1;
    const twentyPercentHeight = win.height*0.2;

    return (
      <View style={logInStyles.greenBackgroundLogIn}>
        <View style={{alignItems:'center'}} >
          <Image
            source={require("./../assets/images/jummumTypeWhite.png")}
            style={{width:220,height:207/835*220,position:'absolute',top:tenPercentHeight}}
          />
        </View>
        <View style={{justifyContent:'center', alignItems:'center',top:twentyPercentHeight}} >
          <Text style={logInStyles.welcome}>Log in</Text>
          <Text style={logInStyles.welcome}></Text>
          <Text style={logInStyles.welcome}></Text>
          <TextInput
          style={logInStyles.loginTextInput}
          placeholder=" Email"
          onChangeText={(text) => this.setState({ username: text, display: false})}
          value={this.state.username}
          />
          <Text style={logInStyles.welcome}></Text>
          <TextInput
          secureTextEntry={true}
          style={logInStyles.loginTextInput}
          placeholder=" Password"
          onChangeText={(text) => this.setState({ password: text, display: false})}
          value={this.state.password}
          />
          <Text style={logInStyles.welcome}></Text>
          <Button buttonStyle={logInStyles.logInButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.logIn} title="Log in"/>
          <Text style={logInStyles.welcome}></Text>
          <Button buttonStyle={logInStyles.rememberMeButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} onPress={this.rememberMe} title={this.state.rememberMe}/>
          <Button buttonStyle={logInStyles.rememberMeButton} titleStyle={{fontFamily: "Prompt-SemiBold"}} onPress={this.forgotPassword} title="ลืมรหัสผ่าน"/>
          <MessageBox display={ this.state.display } message={this.state.message} messageTitle={this.state.messageTitle} onClose={this.onClose}/>
        </View>
        <View style={{position: 'absolute',
    bottom:0}}>
          <Image
            source={require("./../assets/images/jummumLogoCrop2.png")}
            style={{width:win.width,height:imageHeight}}
          />
        </View>
        <Spinner isVisible={this.state.showSpinner} style={{position:'absolute',top:(Dimensions.get('window').height-30)/2,left:(Dimensions.get('window').width-30)/2}} color={'#a2a2a2'} size={15} type={'Circle'}/>
      </View>
    );
  }
}
const logInStyles = StyleSheet.create({

  welcome: {
    backgroundColor: "transparent",
    fontFamily: "Prompt-SemiBold",
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
  },


  greenBackgroundLogIn: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    // alignSelf: 'stretch',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(99,219,199,1)",
    opacity: 1,
  },
  loginTextInput:
  {
    fontFamily: "Prompt-Regular",
    width: 260,
    height: 30,
    backgroundColor: 'white',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5
  },
  logInButton: {
    // color: "#000000",
    backgroundColor: "rgba(255, 59,74, 1)",
    width: 260,
    height: 40,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20,
  },
  rememberMeButton: {
    // fontFamily: "Prompt-SemiBold",
    backgroundColor: "transparent",
    // opacity: 0,
    width: 260,
    height: 40,
    borderColor: "transparent",
    borderWidth: 0,
  },
});

export default LogInScreen;
