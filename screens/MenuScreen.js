import React, {Component}  from 'react';
import { StyleSheet, Text , FlatList, Dimensions, TouchableWithoutFeedback, View } from 'react-native';


const data = [
  { key: 'เมนูอาหารหลัก \nและส่วนลด' },
  { key: 'เมนูอาหารอื่นๆ' },
  { key: 'รายการโน้ต' },
  { key: 'ส่วนลด' },
  { key: 'Hot Deal' },
  { key: 'Lucky Draw' },
  { key: 'ตั้งค่าร้านอาหาร' },
  { key: 'ออกจากระบบ' },
];

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

const numColumns = 2;
export class MenuScreen extends Component
{

  actionOnRow(item) {
   console.log('Selected Item :',item);
   if(item.key == 'เมนูอาหารหลัก \nและส่วนลด')
   {
     console.log('yes menu click:'+this.props.navigation.state.params.branchID);
     this.props.navigation.navigate('MenuOnOffScreen',
      {'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username});
   }
   else if(item.key == 'ตั้งค่าร้านอาหาร')
   {
     this.props.navigation.navigate('BranchSettingScreen',
      {'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username});
   }
   else if(item.key == 'ส่วนลด')
   {
     this.props.navigation.navigate('TestScreen',
      {'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username});
   }
   else if(item.key == 'ออกจากระบบ')
   {
     this.props.navigation.state.params.onGoBack();
     this.props.navigation.goBack(null);
   }
   else
   {
     console.log('no');
   }
  }

  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <TouchableWithoutFeedback onPress={ () => this.actionOnRow(item)}>
        <View
          style={styles.item}
        >
          <Text style={styles.itemText}>{item.key}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    console.log("menu screen:"+this.props.navigation.state.params.branchID);
    return (
      <View style={styles.background}>
      <View style={styles.centerInContainer} >
        <Text style={styles.itemTex}></Text>
        <Text style={styles.itemTitle}>สวัสดี</Text>
        <Text style={styles.itemTextRegular}>ธิดาภรณ์</Text>
      </View>
        <FlatList
          data={formatData(data, numColumns)}
          style={styles.container}
          renderItem={this.renderItem}
          numColumns={numColumns}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
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
    paddingTop: 40,
    alignItems: 'center',
    height:100,
  },
  container: {
    flex: 1,
    marginVertical: 20,
  },
  item: {
    backgroundColor: '#dff7f3',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / numColumns, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemTitle: {
    fontFamily: "Prompt-SemiBold",
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  itemTextRegular: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    textAlign: 'left',
    color: '#FFFFFF',
  },
  itemText: {
    fontFamily: "Prompt-SemiBold",
    fontSize: 18,
    textAlign: 'center',
    color: '#232323',
  },
  textAlignLeft: {
    textAlign: 'left',
  },
});
export default MenuScreen;
