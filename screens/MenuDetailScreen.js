import React, {Component}  from 'react';
import { StyleSheet, Text, View, Dimensions, Image,TextInput,Alert,TouchableOpacity,Picker,ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import MessageBox from './../screens/MessageBox.js';
import MessageBoxConfirm from './../screens/MessageBoxConfirm.js';
import ImagePicker from 'react-native-image-picker';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-spinkit';
import SelectInput from 'react-native-select-input-ios';


const statusOptions = [
  { value: 1, label: 'มีของ' },
  { value: 2, label: 'ของหมด' },
  { value: 3, label: 'ยังไม่เริ่มใช้' },
  { value: 0, label: 'ไม่ใช้แล้ว' }
]


const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export class MenuDetailScreen extends Component
{
  constructor(props)
  {
    super(props);

    branchID = this.props.navigation.state.params.branchID;
    if(this.props.navigation.state.params.menuID == 0)//new
    {
      newMenu = true;
      imageSource = require("./../assets/images/NoImage.jpg");
      this.state = {
        newMenu: newMenu,
        display: false,
        displayConfirmBox: false,
        message: '',
        messageTitle: '',
        messageConfirmBox: '',
        messageTitleConfirmBox: '',
        username: this.props.navigation.state.params.username,
        branchID: this.props.navigation.state.params.branchID,
        menuID: 0,
        titleThai: "",
        price: "",
        recommended: true,
        buffetMenu: false,
        alacarteMenu: true,
        timeToOrder: 0,
        avatarSource: imageSource,
        imageBase64: "",
        imageChanged: false,
        imageType: "",
        menuTypeID: this.props.navigation.state.params.menuTypeID,
        showSpinner: false,
        status: 1,
      };
    }
    else
    {
      newMenu = false;
      imageUrl = this.props.navigation.state.params.imageUrl;
      if(imageUrl == "")
      {
        imageSource = require("./../assets/images/NoImage.jpg");
      }
      else
      {
        uri = 'https://jummum.co/app/dev_jor/JORDownloadImageGet.php?branchID='+branchID+'&imageFileName='+imageUrl+'&type=1';
        imageSource = {uri:uri};
      }
      console.log("timeToOrder:"+this.props.navigation.state.params.timeToOrder);
      this.state = {
        newMenu: newMenu,
        display: false,
        displayConfirmBox: false,
        message: '',
        messageTitle: '',
        messageConfirmBox: '',
        messageTitleConfirmBox: '',
        username: this.props.navigation.state.params.username,
        branchID: this.props.navigation.state.params.branchID,
        menuID: this.props.navigation.state.params.menuID,
        titleThai: this.props.navigation.state.params.titleThai,
        price: this.props.navigation.state.params.price,
        recommended: this.props.navigation.state.params.recommended,
        buffetMenu: this.props.navigation.state.params.buffetMenu,
        alacarteMenu: this.props.navigation.state.params.alacarteMenu,
        timeToOrder: this.props.navigation.state.params.timeToOrder,
        avatarSource: imageSource,
        imageBase64: "",
        imageChanged: false,
        imageType: "",
        showSpinner: false,
        goBack:false,
        status: this.props.navigation.state.params.status,
      };
    }


  }

  componentDidMount()
  {
    this.props.navigation.setParams({ handleSave: this.saveDetails });
  }

  chooseImage = () =>
  {
    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else
      {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          avatarSource: source,
          imageBase64: response.data,
          imageChanged: true,
          imageType: response.type.split("/")[1]
        });
      }
    });
  }

    triggerModal = (message, goBack) =>
    {
      this.setState({
        display: true,
        message: message,
        goBack: goBack,
      })
    }

    saveDetails = () => {
      if(this.state.titleThai == "")
      {
        this.triggerModal("กรุณาใส่ชื่อเมนู", false);
        return;
      }
      if(this.state.price == "")
      {
        this.triggerModal("กรุณาใส่ราคา", false);
        return;
      }
      console.log("save timeToOrder:"+this.state.timeToOrder);
      if(this.state.buffetMenu && this.state.timeToOrder == 0)
      {
        this.triggerModal("กรุณาใส่เวลาในการสั่งบุฟเฟ่ต์ (นาที)", false);
        return;
      }
      this.setState({showSpinner:true});

      fetch('https://jummum.co/app/dev_jor/JORMenuUpdate.php',
      {
        method: 'POST',
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          branchID: this.state.branchID,
          menuTypeID:this.state.menuTypeID,
          menuID: this.state.menuID,
          titleThai: this.state.titleThai,
          price: this.state.price,
          status: this.state.status,
          recommended: this.state.recommended,
          buffetMenu: this.state.buffetMenu,
          alacarteMenu: this.state.alacarteMenu,
          timeToOrder: this.state.timeToOrder*60,
          imageBase64:this.state.imageBase64,
          imageChanged:this.state.imageChanged,
          imageType:this.state.imageType,
          modifiedUser: this.state.username,
          modifiedDate: new Date().toLocaleString()
        })
      })
      .then((response) => response.json())
      .then((responseData) =>{
        console.log(responseData);
        if(responseData.success == true)
        {
          this.setState({showSpinner:false});
          this.triggerModal("บันทึกสำเร็จ", true);
        }
      }).done();
    }

    recommendedClick = () => {
      this.setState({recommended:!this.state.recommended});
    }

    buffetMenuClick = () =>
    {
      if(!this.state.buffetMenu)
      {
        this.setState({timeToOrder:'360'});
      }
      else
      {
        console.log("buffetMenuClick yes");
        this.setState({timeToOrder:'0'});
      }
      this.setState({buffetMenu:!this.state.buffetMenu});
    }

    alacarteMenuClick = () => {
      this.setState({alacarteMenu:!this.state.alacarteMenu});
    }

    priceChanged = (text) =>
    {
      this.setState({ price: text.replace(/[^0-9]/g, ''),})
    }

    timeToOrderChanged = (text) =>
    {
      console.log("timeToOrderChanged");
      this.setState({ timeToOrder: text.replace(/[^0-9]/g, ''),})
    }

    onClose = () =>
    {
      if(this.state.goBack)
      {
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack(null);
      }
      else
      {
        this.setState({display:false});
      }
    }

    confirm = () =>
    {
      this.setState({displayConfirmBox:false});
      this.deleteMenu();
    }

    cancel = () =>
    {
      this.setState({displayConfirmBox:false});
    }

    confirmDelete = () =>
    {
      this.setState({displayConfirmBox:true,messageConfirmBox: '',
      messageTitleConfirmBox: 'ยืนยันลบเมนูนี้'});
    }

    deleteMenu = () =>
    {
      this.setState({showSpinner:true});
      fetch('https://jummum.co/app/dev_jor/JORMenuDelete.php',
      {
        method: 'POST',
        headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        body: JSON.stringify({
          branchID: this.state.branchID,
          menuID: this.state.menuID,
          modifiedUser: this.state.username,
          modifiedDate: new Date().toLocaleString()
        })
      })
      .then((response) => response.json())
      .then((responseData) =>{
        console.log(responseData);
        if(responseData.success == true)
        {
          this.setState({showSpinner:false});
          this.triggerModal("ลบเมนูสำเร็จ", true);
        }
        else
        {
          this.setState({showSpinner:false});
          this.triggerModal("ไม่สามารถลบได้ คุณสามารถเปลี่ยนสถานะเป็น 'ไม่ใช้แล้ว' แทนได้", false);
        }
      }).done();
    }

    setSpecialPrice = () =>
    {
      this.props.navigation.navigate('SpecialPriceSettingScreen',
      {
        'branchID': this.props.navigation.state.params.branchID,
        'username': this.props.navigation.state.params.username,
        'menuID':this.state.menuID,
        'avatarSource': this.state.avatarSource,
        'titleThai': this.state.titleThai,
        'price': this.state.price
      });
    }

    render()
    {
    return (
      <ScrollView>
      <View style={{flex:1}}>
        <Text></Text>
        <TouchableOpacity
          onPress={ () => this.chooseImage()}
          style={{alignItems:'center'}}
        >
        <Image
          source={this.state.avatarSource}
          style={{width:150,height:150,borderRadius:10}}
        />
        </TouchableOpacity>
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
        <Text style={styles.label}>ชื่อเมนู</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <TextInput
        style={[styles.textInput,{height:55}]}
        placeholder=" ชื่ออาหาร"
        onChangeText={(text) => this.setState({ titleThai: text})}
        value={this.state.titleThai}
        multiline={true}
        />
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row'}}>
        <Text style={styles.label}>ราคา</Text><Text style={[styles.label,{color:"#FF3C4B"}]}> *</Text>
        </View>
        <TextInput
        style={styles.textInput}
        placeholder=" ราคา"
        keyboardType="numeric"
        onChangeText={(text) => this.priceChanged(text)}
        value={this.state.price}
        />
        <Text style={styles.label}></Text>
        <Text style={styles.label}>สถานะ</Text>
        <SelectInput
          style={styles.selectInput}
          labelStyle={{fontFamily: 'Prompt-Regular',lineHeight:28}}
          buttonsTextStyle={styles.buttonText}
          buttonsViewStyle={{backgroundColor:"#ECECEC",borderColor:"#C7C7C7"}}
          pickerItemStyle={{fontFamily:"Prompt-Regular"}}
          pickerViewStyle={{backgroundColor:"#C7C7C7",height:150}}
          onValueChange={(value)=>{this.setState({status:value})}}
          value={this.state.status}
          options={statusOptions}  />
        <Text style={styles.label}></Text>
        <View style={{display:'flex',flexDirection:'row', width:Dimensions.get('window').width}}>
          <View>
            <CheckBox
              title='เมนูบุฟเฟ่ต์'
              checked={this.state.buffetMenu}
              checkedColor='#64DCC8'
              containerStyle={[styles.checkBoxContainer]}
              textStyle={styles.checkBoxText}
              onPress={this.buffetMenuClick}
            />
          </View>
          {
            this.state.buffetMenu?(<View style={{flex:1,justifyContent:'center'}}>
              <Text style={[styles.label,{left:null}]}>เวลาในการสั่งบุฟเฟ่ต์​ (นาที)</Text>
              <TextInput
              style={[styles.textInput,{left:null,width:100}]}
              keyboardType="numeric"
              editable={this.state.buffetMenu}
              onChangeText={(text) => this.timeToOrderChanged(text)}
              value={this.state.timeToOrder+""}
              />
            </View>):null
          }
        </View>
        <CheckBox
          title='เมนูหลัก'
          checked={this.state.alacarteMenu}
          checkedColor='#64DCC8'
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxText}
          onPress={this.alacarteMenuClick}
        />
        <CheckBox
          title='แนะนำ'
          checked={this.state.recommended}
          checkedColor='#64DCC8'
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxText}
          onPress={this.recommendedClick}
        />
        {
          this.state.buffetMenu?(<Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.setSpecialPrice} title="ดูเมนูของบุฟเฟ่ต์"/>):null
        }
        {
          this.state.buffetMenu?(<Text style={styles.label}></Text>):null
        }
        {
          this.state.buffetMenu?(<Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.setSpecialPrice} title="ตั้งค่าเมนูของบุฟเฟ่ต์"/>):null
        }
        {
          this.state.buffetMenu?(<Text style={styles.label}></Text>):null
        }
        <Button buttonStyle={styles.buttonAction} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.setSpecialPrice} title="ตั้งค่าส่วนลด"/>
        <Text style={styles.label}></Text>
        <Button buttonStyle={this.state.newMenu?styles.hide:styles.button} titleStyle={{fontFamily: "Prompt-SemiBold"}} color="#000000" onPress={this.confirmDelete} title="ลบเมนูนี้"/>
        <Text style={styles.label}></Text>
        <MessageBox
          display={this.state.display}
          message={this.state.message}
          messageTitle={this.state.messageTitle}
          onClose={this.onClose}
        />
        <MessageBoxConfirm
          display={this.state.displayConfirmBox}
          message={this.state.messageConfirmBox}
          messageTitle={this.state.messageTitleConfirmBox}
          onConfirm={this.confirm}
          onCancel={this.cancel}
        />
        <Spinner isVisible={this.state.showSpinner} style={{position:'absolute',top:(Dimensions.get('window').height-30)/2,left:(Dimensions.get('window').width-30)/2}} color={'#a2a2a2'} size={15} type={'Circle'}/>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // marginVertical: 20,
  },
  label: {
    left:20,
    backgroundColor: "transparent",
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    textAlign: 'left',
    color: '#464646',
  },
  checkBoxContainer:
  {
    backgroundColor:"#ffffff",
    borderWidth:0
  },
  checkBoxText: {fontFamily:"Prompt-Regular",color: '#464646',},
  textInput:
  {
    fontFamily:"Prompt-Regular",
    left:20,
    width: Dimensions.get('window').width-2*20,
    height: 30,
    backgroundColor: 'white',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5
  },
  selectInput:
  {
    left:20,
    width: Dimensions.get('window').width-2*20,
    height: 30,
    backgroundColor: 'white',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5
  },
  button: {
    backgroundColor: "rgba(255, 59,74, 1)",
    left: 20,
    width: Dimensions.get('window').width-2*20,
    height: 40,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20,
  },
  buttonAction: {
    backgroundColor: "#64DCC8",
    left: 20,
    width: Dimensions.get('window').width-2*20,
    height: 40,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20,
  },
  hide:
  {
    display:'none'
  },
  buttonText:{fontFamily: 'Prompt-SemiBold',color: '#64DCC8'}
});
export default MenuDetailScreen;
