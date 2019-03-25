import React, {Component}  from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from "react-native-underline-tabbar";
import DefaultPreference from 'react-native-default-preference';
import MenuDetailScreen from './../screens/MenuDetailScreen.js';
import { SearchBar } from 'react-native-elements';
import DraggableFlatList from 'react-native-draggable-flatlist';
import SortableGrid from 'react-native-sortable-grid'
import _ from 'lodash';


const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
  while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
    data.push({ titleThai: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

titleTextBottom = 0;
numColumns = 2;
export class MenuOnOffScreen extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      branchID: this.props.navigation.state.params.branchID,
      username: this.props.navigation.state.params.username,
      menuType: [],
      selectedMenuType: 0,
      loading: true,
      search: '',
      data:[],
      menuTypeID:-1,
      selectedIndex:0,
    };
  }

  componentDidMount()
  {
    this.loadMenu();
    this.props.navigation.setParams({ handleNewMenu: this.newMenu });
    this.props.navigation.setParams({ showNewButton: false });

  }

  newMenu = () =>
  {
    this.props.navigation.navigate('MenuDetailScreen',
    {
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'menuID':0,
      'menuTypeID': this.state.menuType[this.state.selectedIndex].MenuTypeID,
      onGoBack:()=>this.loadMenu()
    });
  }

  updateMenuList = (data) =>
  {
    //MenuList
    fetch('https://jummum.co/app/dev_jor/JORMenuUpdateList.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
        menu: data,
      })
    })
    .then((response) => response.json())
    .then((responseData) =>{
    }).done();
  }

  updateSearch = search => {
    this.setState({ search: search });
  };

  loadMenu = () =>
  {
    fetch('https://jummum.co/app/dev_jor/JORMenuGetList.php',
    {
      method: 'POST',
      headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
      body: JSON.stringify({
        branchID: this.state.branchID,
      })
    })
    .then((response) => response.json())
    .then((responseData) =>{
      this.setState({menuType:responseData.data.MenuType,
        branchImageUrl:responseData.data.BranchImageUrl
      })
    }).done();
  };

  actionOnRow(item) {
    this.props.navigation.navigate('MenuDetailScreen',
    {
      'branchID': this.props.navigation.state.params.branchID,
      'username': this.props.navigation.state.params.username,
      'menuID':item.menuID,
      'titleThai':item.titleThai,
      'price':item.price,
      'recommended':item.recommended,
      'buffetMenu':item.buffetMenu,
      'alacarteMenu':item.alacarteMenu,
      'imageUrl':item.imageUrl,
      'status':item.status,
      onGoBack:()=>this.loadMenu()
    });
 };

 onChangeTab = (item) =>
 {
   this.setState({selectedIndex:item.i});
   if(item.i == 0 || item.i == this.state.menuType.length-1)
   {
     this.props.navigation.setParams({ showNewButton: false });
   }
   else
   {
     this.props.navigation.setParams({ showNewButton: true });
   }
 }


 measureView(event,menuID)
 {
   console.log('event peroperties: ', event);
   console.log('menuID: ', menuID);
   this.setState({
         x: event.nativeEvent.layout.x,
         y: event.nativeEvent.layout.y,
         width: event.nativeEvent.layout.width,
         height: event.nativeEvent.layout.height
     })
     titleTextBottom = event.nativeEvent.layout.y+event.nativeEvent.layout.height;
     console.log('titleTextBottom: ', titleTextBottom);
 }

  Page = ({label,menuTypeID}) =>
  {
    if(menuTypeID != this.state.menuTypeID )
    {
      data = [];
      selectedMenuType = this.state.menuType.filter((menuType) => menuType.MenuTypeID == menuTypeID);
      selectedMenuType.map((menuType)=>{
        menu = menuType.Menu;
        menu.map((menu)=>{
          var parts = (+menu.Price).toFixed(2).split(".");
          price = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+parts[1];
          hasFood = menu.Status == 1?true:false;
          recommended = menu.Recommended == 1;
          buffetMenu = menu.BuffetMenu == 1;
          alacarteMenu = menu.AlacarteMenu == 1;
          data.push({key:menu.MenuID,label:menu.TitleThai,backgroundColor:'#FF3C4B',menuTypeID:menu.MenuTypeID,menuID:menu.MenuID,titleThai:menu.TitleThai, price:price, imageUrl:menu.ImageUrl, status:menu.Status, orderNo:menu.OrderNo, hasFood:hasFood, recommended:recommended, buffetMenu:buffetMenu, alacarteMenu:alacarteMenu, imageUrl:menu.ImageUrl, status:parseInt(menu.Status)});
        });
        data = data.sort(function (a, b) {
          return a.orderNo - b.orderNo;
        });
      });

      data = data.filter((menu) => menu.titleThai.toLowerCase().includes(this.state.search.toLowerCase()));
    }
    else
    {
      data = this.state.data;
    }


    //set numColumns
    if(menuTypeID == 0)
    {
      numColumns = 2;
    }
    else
    {
      numColumns = 1;
    }

    if(menuTypeID == 0)
    {
      flatListComp = (<FlatList
        data={formatData(data, numColumns)}
        style={styles.container}
        contentContainerStyle={{
      padding: menuTypeID==0?7:0}}
        renderItem={this.renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
      />);
    }
    else if(menuTypeID == 100)
    {
      flatListComp = (<FlatList
        data={formatData(data, numColumns)}
        style={styles.container}
        contentContainerStyle={{
      padding: menuTypeID==0?7:0}}
        renderItem={this.renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
      />);
    }
    else
    {
      flatListComp = (<DraggableFlatList
        data={formatData(data, numColumns)}
        style={styles.container}
        contentContainerStyle={{
      padding: menuTypeID==0?7:0}}
        renderItem={this.renderItem}
        numColumns={numColumns}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
        scrollPercent={5}
        onMoveEnd={({ data }) =>
          {
            this.updateMenuList(data);
            this.setState({ data:data,menuTypeID:menuTypeID });}}
      />);
    }

    return (<View style={styles.container}>
      <SearchBar
      containerStyle={{backgroundColor:"transparent",borderWidth:0,borderColor:"#FFFFFF",borderBottomColor: '#CCCCCC',
 borderTopColor: 'transparent'}}
 inputContainerStyle= {{backgroundColor:"transparent",borderWidth:0,borderRadius:5,borderColor:"#FF3C4B"}}

      inputStyle={{fontFamily:"Prompt-Regular"}}
      placeholder="ค้นหาเมนู"
      onChangeText={this.updateSearch}
      value={this.state.search}
    />
    {flatListComp}
    </View>);
  };

  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    //generalMenu
    if(item.imageUrl == "")
    {
      branchImageUrl = this.state.branchImageUrl;
      uri = 'https://jummum.co/app/dev_jor/JORDownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+branchImageUrl+'&type=2';
    }
    else
    {
      uri = 'https://jummum.co/app/dev_jor/JORDownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+item.imageUrl+'&type=1';
    }

    runOutImageSource = item.status == 2?require("./../assets/images/foodRunOutLabel.png"):require("./../assets/images/foodRunOutLabel_blank.png");

    generalMenu = (
    <View
      style={[styles.item,{backgroundColor: isActive ? '#dff7f3' : '#FFFFFF'}]}
      >
      <Image
        source={runOutImageSource}
        style={styles.foodRunOutLabel}
      />
      <Image
        source={{uri: uri}}
        style={{width:70,height:70,position:'absolute',top:10,left:10,borderRadius:10}}
      />
      <Text onLayout={(event,menuID) => this.measureView(event,menuID)} style={styles.itemText} ellipsizeMode='tail' numberOfLines={2} >{item.titleThai}</Text>
      <Text style={[styles.itemSub]}>฿ {item.price}</Text>
    </View>);

    recommendedMenu =
    (
      <View
        style={styles.itemRecommended}
        >
        <Image
          source={item.status == 2?require("./../assets/images/foodRunOutLabel.png"):require("./../assets/images/foodRunOutLabel_blank.png")}
          style={styles.foodRunOutLabel}
        />
        <Image
          source={{uri: 'https://jummum.co/app/dev_jor/JORDownloadImageGet.php?branchID='+this.state.branchID+'&imageFileName='+item.imageUrl+'&type=1'}}
          style={{width: (Dimensions.get('window').width-3*10)/2,
          height: (Dimensions.get('window').width-3*10)/2}}
        />
        <Text style={styles.itemTextRecommended} ellipsizeMode='tail' numberOfLines={2}>
          {item.titleThai}
        </Text>
        <Text style={styles.itemSubRecommended}>฿ {item.price}</Text>
      </View>
    )

    if(item.menuTypeID == 0)
    {
      menuItem = recommendedMenu;
    }
    else
    {
      menuItem = generalMenu;
    }

    //menutype == 100 -> cannot sort
    if(item.menuTypeID == 100)
    {
      itemView = (<TouchableOpacity
        onPress={ () => this.actionOnRow(item)}
        style={{

        borderWidth:4,
        borderColor:'transparent'
      }}

      >
      {menuItem}
      </TouchableOpacity>);
    }
    else
    {
      itemView = (<TouchableOpacity
        onPress={ () => this.actionOnRow(item)}
        style={{

        borderWidth:4,
        borderColor:'transparent'
      }}

      >
      {menuItem}
      </TouchableOpacity>);
    }

    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }


    {
      return (
        <TouchableOpacity
          onPress={ () => this.actionOnRow(item)}
          style={{
          borderWidth:4,
          borderColor:'transparent'
        }}
        onLongPress={move}
        onPressOut={moveEnd}
        >
        {menuItem}
        </TouchableOpacity>
      );
    }
  };

  render() {
    return (
        <View style={[styles.container, {paddingTop: 0}]}>

        <ScrollableTabView
          onChangeTab = {(item) => {this.onChangeTab(item)}}
          tabBarActiveTextColor = "#FF3C4B"
          renderTabBar={() => <TabBar underlineColor="#FF3C4B"
            tabBarTextStyle={{fontFamily: "Prompt-SemiBold",color: "#464646"}}
            activeTabTextStyle={{fontFamily: "Prompt-SemiBold",color: "#FF3C4B"}}
            swipeEnabled={false}
            animationEnabled={false}/>}

        >
          {this.state.menuType.map((item, i) => <this.Page key={i} menuTypeID={item.MenuTypeID} tabLabel={{label: item.NameEn}} label={item.NameEn}/>)}
        </ScrollableTabView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  item: {
    backgroundColor: '#ffffff',
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    height: 90,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemRecommended:
  {
    backgroundColor: '#ffffff',
    width: (Dimensions.get('window').width-3*10)/2,
    height: (Dimensions.get('window').width-3*10)/2+2*40,
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  itemText: {
    fontFamily: "Prompt-SemiBold",
    fontSize: 14,
    textAlign: 'left',
    color: '#005A50',
    top: 10,
    left: 100,
    marginRight: 100+10,
    overflow: 'hidden',
  },
  itemSub: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    textAlign: 'left',
    color: '#464646',
    left: 100,
    paddingTop: 10,
  },
  itemTextRecommended: {
    fontFamily: "Prompt-SemiBold",
    fontSize: 14,
    textAlign: 'left',
    color: '#005A50',
    paddingTop: 10,
    left: 10,
    marginRight: 10,
    overflow: 'hidden',
  },
  itemSubRecommended: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    textAlign: 'left',
    color: '#464646',
    left: 10,
    paddingTop: 10,
  },
  foodRunOutLabel:{width:35,height:35,position:'absolute',top:0,right:0},
});
export default MenuOnOffScreen;
