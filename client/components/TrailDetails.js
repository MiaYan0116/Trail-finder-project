/*
TrailDetail is one reusable component that is used for both HomeScreen, WishlistScreen, ResultScreen and RecommendationScreen.
*/
import React, { useEffect, useState, useRef } from 'react'
import { Modal, Pressable, Image, StyleSheet, View, Text, ScrollView, Alert, Animated } from 'react-native'
import { db, auth } from '../firebase/firebaseSetup';
import colors from "../helper/colors";
import fontSizes from "../helper/fontSizes";
import paddings from "../helper/paddings";
import RatingStars from './RatingStars';
import { format } from 'date-fns-tz';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUserByUserAuthId, addWishItemToFireStore, deleteWishItemFromFireStore, updateUser } from '../firebase/firestore';
import { Calendar } from 'react-native-calendars';
import { mapAPIKey } from '@env';
import NotificationManager from "./NotificationManager";
import MapView, { Marker } from 'react-native-maps';
import SingleButton from './SingleButton';
import { themeBackgroundColor } from '../styles';

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
  const heartScale = useRef(new Animated.Value(1)).current;


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

  const triggerHeartAnimation = () => {
    Animated.sequence([
      // magnify the heart icon
      Animated.timing(heartScale, {
        toValue: 2.5,
        duration: 230,
        useNativeDriver: true,
      }),
      // bounce
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 2,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
};



  // If the like button is hit, update the wishlist and users collections accordingly
  const handleIsLiked = () => {
    setIsLiked((prevIsLiked) => {
      const newIsLiked = !prevIsLiked;
      if (newIsLiked) {
        triggerHeartAnimation();
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


    // Because the layouts of each detail items are similar, we here store the layout as a reusable function DetailItem
  // the parameters are: name of the icon, value of the text input, and style of the useState of the detail item.
  function DetailItem( {iconName, textInput, itemState} ) {
    return (
      <View style={styles.listItem}>
        <View style={styles.iconContainer}>
          <Icon name={iconName} size={20} color={colors.themeBackgroundColor} />
        </View>
        <View>
          <Text style={styles.label}>{textInput}</Text>
          <Text>{itemState}</Text>
        </View>
      </View>
    )
  }



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
            onDayPress={handleSelectDate}
            markedDates={{
              [selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
            }}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setIsCalendarVisible(!isCalendarVisible)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </Modal>

      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{item.trailTitle}</Text>
          <Pressable onPress={handlePressLike}>
            {({ pressed }) => (
              <Animated.View style={{ transform: [{ scale: heartScale }], marginTop: 6 }}>
                <Icon
                  name={isLiked ? 'heart' : 'heart-o'}
                  size={25}
                  color={isLiked ? themeBackgroundColor : colors.themeBackgroundColor}
                />
              </Animated.View>
            )}
          </Pressable>
          <NotificationManager selectedDate={selectedDate} trailName={item.trailTitle} isLiked={isLiked} changedHandler={handleChange} selectedTime={selectedTime}/>
                   
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Icon name='star' size={20} color={colors.themeBackgroundColor} />
            </View>
            <View>
              <Text style={styles.label}>Rating</Text>
              <Text>{RatingStars({ rate })}</Text>
            </View>
          </View>
          <DetailItem iconName='bus' textInput='Public Transit' itemState={publicTransit} />
          <DetailItem iconName='paw' textInput='Dog Friendly' itemState={dogFriendly} />
          <DetailItem iconName='wrench' textInput='Difficulty' itemState={item.difficulty} />
          <DetailItem iconName='fire' textInput='Camping' itemState={camping} />
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
		backgroundColor: colors.background, 
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
    paddingHorizontal: paddings.small,
		marginLeft: 35,
    flexDirection: "row",
    
	},
	titleText: {
		fontSize: fontSizes.large,
		fontWeight: 'bold',
		color: colors.themeBackgroundColor,
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
    backgroundColor: colors.calendarBackgroundColor,
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
    paddingHorizontal: paddings.medium,
    paddingVertical: paddings.extrasmall,
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
    fontSize: fontSizes.extrasmall,
    color: colors.themeBackgroundColor
  },
  fullMapView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
  },
  modalView: {
    marginTop: 300,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: paddings.large,
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
    padding: paddings.extrasmall,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: colors.buttonCloseColor,
  },
  textStyle: {
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center"
  },
})

export default TrailDetails