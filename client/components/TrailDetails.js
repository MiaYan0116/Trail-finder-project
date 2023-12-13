import React, { useEffect, useState } from 'react'
import { Modal, Pressable, Image, StyleSheet, View, Text, ScrollView, Alert } from 'react-native'
import { db, auth } from '../firebase/firebaseSetup';
import { themeBackgroundColor } from '../styles';
import RatingStars from './RatingStars';
import { format } from 'date-fns-tz';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUserByUserAuthId, addWishItemToFireStore, deleteWishItemFromFireStore, updateUser } from '../firebase/firestore';
import { Calendar } from 'react-native-calendars';
import { mapAPIKey } from '@env';
import NotificationManager from "./NotificationManager";
import MapView, { Marker } from 'react-native-maps';
import SingleButton from './SingleButton';

const TrailDetails = ({ navigation, route }) => {

  const item = route.params.pressedItem;
  console.log(item);
  const [isLiked, setIsLiked] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const imageUri = item.imageUri;
  const rate = item.rating;
  let publicTransit;
  let dogFriendly;
  let camping;
  if(item.publicTransit === "FALSE"){
    publicTransit = 'No';
  }else{
    publicTransit = 'Yes';
  }
  if(item.dogFriendly === "FALSE"){
    dogFriendly = 'No';
  }else{
    dogFriendly = 'Yes';
  }
  if(item.camping === "FALSE"){
    camping = 'No';
  }else{
    camping = 'Yes';
  }
  
  const [user, setUser] = useState({});
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [userCid, setUserCid] = useState('');
  const [wishitems, setWishitems] = useState([]);
  const [isFullMapVisible, setIsFullMapVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const { userData, userId } = await getUserByUserAuthId(auth.currentUser.uid);
          setUser(userData || {});
          setDescription(userData.description || '');
          setUsername(userData.username || '');
          setUserCid(userId || '');
          setWishitems(userData.wishitems || '');
          const isTrailTitleIncluded = userData.wishitems.some(wishitem => wishitem.trailTitle === item.trailTitle);
          setIsLiked(isTrailTitleIncluded);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleIsLiked = () => {
    setIsLiked((prevIsLiked) => {
      const newIsLiked = !prevIsLiked;
      if (newIsLiked) {
        const wishData = {"userCid": userCid, "trailTitle": item.trailTitle}
        addWishItemToFireStore(wishData);
        setWishitems((prevWishitems) => {
          const newWishitems = [...prevWishitems, wishData]
          updateUser(userCid, {wishitems: newWishitems});
          return newWishitems;
        });
      } else {
        deleteWishItemFromFireStore(userCid, item.trailTitle);
        setWishitems((prevWishitems) => {
          const newWishitems = prevWishitems.filter((wishItem) => wishItem.trailTitle != item.trailTitle);
          updateUser(userCid, {wishitems: newWishitems});
          return newWishitems;
        })
      }
      return newIsLiked;
    })
  }

  const handlePressLike = () => {
    if (auth.currentUser) {       
      handleIsLiked();
    } else {
      Alert.alert("You need to login first");
      navigation.navigate('Profile', {screen: 'ProfileScreen'});
    }
  }

  const handleSelectDate = (day) => {
    const timeZone = 'America/Vancouver';
    const currentTimeUnformatted = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS", { timeZone });
    const currentTimeFormatted = `${currentTimeUnformatted}Z`;
    const currentTime = new Date(currentTimeFormatted);
    console.log("The current time when user selects the date is: ", currentTime);
    setSelectedTime(currentTime);
    setSelectedDate(day.dateString);
    console.log("The selected date is: ", selectedDate);
    setIsCalendarVisible(false);
  }

  const handleChange = (data) => {
    setIsCalendarVisible(data);
  }

  const handleMapPress = () => {
    setIsFullMapVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
			<Image
				source={{uri: imageUri}}
				style={styles.image}
			/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={() => {
          setIsCalendarVisible(!isCalendarVisible);
        }}
      >
        <View style={styles.modalView}>
          <Calendar
            // ... 日历组件的其它属性
            onDayPress={handleSelectDate}
            markedDates={{
              [selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
            }}
          />
          {/* 添加一个按钮来关闭模态框 */}
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setIsCalendarVisible(!isCalendarVisible)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </Modal>

       {/* {isCalendarVisible && (
            <View style={styles.calendarPopup}>
              <Calendar onDayPress={handleSelectDate}
                        markedDates={{
                          [selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                        }}
              />
            </View>
          )} */}
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{item.trailTitle}</Text>
          <Pressable onPress={handlePressLike}>
            {({ pressed }) => (
              <Icon
                name={isLiked ? 'heart' : 'heart-o'}
                size={25}
                color={pressed ? 'gray' : themeBackgroundColor}
                style={{marginTop: 7}}
              />
            )}
          </Pressable>
          <NotificationManager selectedDate={selectedDate} trailName={item.trailTitle} isLiked={isLiked} changedHandler={handleChange} selectedTime={selectedTime}/>
                   
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Icon name='star' size={20} color={themeBackgroundColor} />
            </View>
            <View>
              <Text style={styles.label}>Rating</Text>
              <Text>{RatingStars({ rate })}</Text>
            </View>
          </View>
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Icon name='bus' size={20} color={themeBackgroundColor} />
            </View>
            <View>
              <Text style={styles.label}>Public Transit</Text>
              <Text>{publicTransit}</Text>
            </View>
          </View>
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Icon name='paw' size={20} color={themeBackgroundColor} />
            </View>
            <View>
              <Text style={styles.label}>Dog Friendly</Text>
              <Text>{dogFriendly}</Text>
            </View>
          </View>
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Icon name='wrench' size={20} color={themeBackgroundColor} />
            </View>
            <View>
              <Text style={styles.label}>Difficulty</Text>
              <Text>{item.difficulty}</Text>
            </View>
          </View>
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Icon name='fire' size={20} color={themeBackgroundColor} />
            </View>
            <View>
              <Text style={styles.label}>Camping</Text>
              <Text>{camping}</Text>
            </View>
          </View>
        </View>
      </View>
      <Pressable onPress={handleMapPress}>
        <MapView
          style={{ height: 110, marginHorizontal: 25, marginTop: -5 }}
          initialRegion={{
            latitude: item.geo.lat,
            longitude: item.geo.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: item.geo.lat, longitude: item.geo.lng }}
            title={item.trailTitle}
          />
        </MapView>
      </Pressable>
      {isFullMapVisible && (
        <View style={styles.fullMapView}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: 49.6168742,
              longitude: -121.0780851,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{ latitude: 49.6168742, longitude: -121.0780851 }}
              title={item.trailTitle}
            />
          </MapView>
          {/* button to hide the entire map */}
          <View style={{alignItems: 'center'}}>
            <SingleButton text={"Close"} handlefunc={() => setIsFullMapVisible(false)} />
          </View>
        </View>
      )}


		</ScrollView>
  )
}

const styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: 'rgba(255,255,255,0.7)', 
    width: '100%',
	},
	image: {
    marginTop: 40,
		marginBottom: 20,
    marginLeft: 40,
    width: '80%',
    height: 260,
    resizeMode: 'cover',
  },
  titleContainer:{
		width: '100%',
    height: 50,
    paddingHorizontal: 15,
		marginLeft: 35,
    flexDirection: "row",
    
	},
	titleText: {
		fontSize: 30,
		fontWeight: 'bold',
		color: themeBackgroundColor,
    marginRight: 25,
	},

  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 7, 
    right: 10, 
  },
  calendarPopup: {
    position: 'absolute',
    backgroundColor: '#C89D7C',
    width: '100%',
    height: '60%',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
  },
  infoContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7
  },
  iconContainer: {
    marginRight: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 17,
    color: themeBackgroundColor
  },
  fullMapView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  modalView: {
    marginTop: 300,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
})

export default TrailDetails