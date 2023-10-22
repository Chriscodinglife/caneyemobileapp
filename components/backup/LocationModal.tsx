import LoginModal from './LoginModal';
import { Location, Review } from './Location';
import ThumbsDownModal from './thumbsDownModal';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { machineDB, auth } from '../firebaseConfig';
import { useAppContext } from './AppContextProvider';
import LocationReviewList from './LocationReviewList';
import { ref, child, update, get } from 'firebase/database';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, Text, StyleSheet, Modal, Button, Image, TouchableOpacity, ImageBackground } from 'react-native';
import ReportMachinesModal from './ReportMachinesModal';

type LocationModalProps = {
  index: number;
  location: Location;
  closeMarkerModal: () => void;
  selectedLocationIndex: number | null;
}

const LocationModal: React.FC<LocationModalProps> = ({ location, closeMarkerModal, selectedLocationIndex, index}) => {
  
  const dbRef = ref(machineDB);
  const { user, updateUser } = useAppContext();
  const [currentLocation, setCurrentLocation] = useState(location);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [thumbsDownModalVisible, setThumbsdownModalVisible] = useState(false);
  const [reportMachinesModalVisible, setReportMachinesModalVisible] = useState(false);

  const handleThumbsUp = () => {

    const currentDate = new Date();

    const newReview: Review = {
      'user': user?.email as string,
      'date': currentDate.toLocaleDateString(),
      'message': "This place looks good!"
    }

    const addReviewToLocation = (location: Location | null | undefined) => {
      const locationRef = child(dbRef, `machines/${location?.placeID}`);

      get(locationRef).then((snapshot) => {
        if (snapshot.exists()) {
          const currentLocationData = snapshot.val();
          console.log(currentLocationData)

          if (!currentLocationData.reviews) {
            currentLocationData.reviews = [];
          }

          currentLocationData.reviews.push(newReview);

          // Update the location locally and in the database
          setCurrentLocation(currentLocationData)
          update(locationRef, currentLocationData)
          .then(() => {
            console.log("New Review Added");
          })
          .catch((error) => {
            console.error("Error adding review");
            alert("There was an error adding the review:" + error.message)
          });
        };

      });
      
    };

    // Run the function
    addReviewToLocation(location);

  };

  // Listen to state changes of the user and pass that along as needed
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      updateUser(user);
    });

  }, []);

  // Listen for changes in the location prop
  useEffect(() => {
    setCurrentLocation(location);
  }, [location]);

  const handleThumbsDown = () => {
    setThumbsdownModalVisible(true)
  };

  return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={selectedLocationIndex === index} // Check if this marker is selected
        onRequestClose={() => closeMarkerModal()}
      >
        <View style={styles.mainView}>
            <ImageBackground source={{ uri: location.imageURL}} style={styles.locationImage}>
              <View style={styles.locationMainBlackBoxHeader}>
                <View style={styles.locationHeaderBox}>
                <TouchableOpacity onPress={() => closeMarkerModal()}>
                    <Text style={styles.closeButtonText}>{`<-`}</Text>
                </TouchableOpacity>
                  <Text style={styles.locationNameSubHeader}>What's recycling at</Text>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <View style={styles.locationAddressBar}>
                    <MaterialIcons name='location-pin' style={styles.locationAddress}/>
                    <Text style={styles.locationAddress}>{location.address}</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
            <View style={styles.reviewActions}>
              <Text style={styles.reviewHeader}>Tell us what you saw</Text>
              { user ? (
                <>
                  <View>
                    <TouchableOpacity style={styles.reportButton} onPress={() => setReportMachinesModalVisible(true)}>
                      <Text style={styles.reportButtonText}>Report Machines</Text>
                    </TouchableOpacity>
                  </View>
                  <ReportMachinesModal
                    reportMachinesModalVisible={reportMachinesModalVisible}
                    location={location}
                    setCurrentLocation={setCurrentLocation}
                    setReportMachinesModalVisible={setReportMachinesModalVisible} />
                  {/* <View style={styles.reviewButtonsRow}>
                    <TouchableOpacity style={styles.thumbsUpButtonBox} onPress={() => handleThumbsUp()}>
                      <MaterialIcons name='thumb-up' style={styles.thumbsUpButton} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.thumbsDownButtonBox} onPress={() => handleThumbsDown()}>
                      <MaterialIcons name='thumb-down' style={styles.thumbsDownButton} />
                    </TouchableOpacity>
                  </View>
                  <ThumbsDownModal 
                    thumbsDownModalVisible={thumbsDownModalVisible} 
                    location={location}
                    setCurrentLocation={setCurrentLocation} 
                    setThumbsdownModalVisible={setThumbsdownModalVisible}/> */}
                </>
              )
              : (
                <>
                  <View style={styles.loginPrompt}>
                    <Button title="Login or Create An Account First to Add Reports" onPress={() => {setLoginModalVisible(true)}} />
                  </View>
                  <LoginModal
                    loginModalVisible={loginModalVisible}
                    setLoginModalVisible={() => setLoginModalVisible(false)} />
                </>
              )}
              <Text style={styles.pastReviewsHeader}>See what others had to say</Text>
              <LocationReviewList reviews={currentLocation.reviews} closeMarkerModal={closeMarkerModal}/>
              <TouchableOpacity style={styles.looksGoodButton} onPress={() => closeMarkerModal()}>
                <Text style={styles.looksGoodText}>Looks Good</Text>
              </TouchableOpacity>
            </View>
        </View>
      </Modal>
  )
}

const styles = StyleSheet.create({
    mainView: {
      flex: 1,
      flexDirection: 'column',
    },
    locationImage: {
      width: "100%",
      height: "72%"
    },
    locationMainBlackBoxHeader: {
      paddingTop: 80,
    },
    closeButtonText: {
      color: 'white',
      fontWeight: "bold",
      fontSize: 20,
      shadowColor: 'white',
      shadowOpacity: 0.5,
      shadowRadius: 2,
      shadowOffset: { height: 0, width: 0}
    },
    locationHeaderBox: {
      backgroundColor: '#00000080',
      paddingLeft: 20,
      paddingVertical: 15,
      paddingBottom: 40,
    },
    locationNameSubHeader: {
      color: 'white',
      fontSize: 18,
      fontWeight: '500',
      paddingVertical: 15,
      shadowColor: "white",
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: {width: 0, height: 0},
    },
    locationName: {
      fontSize: 25,
      fontWeight: 'bold',
      color: 'white',
      shadowColor: "white",
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: {width: 0, height: 0},
    },
    locationAddressBar: {
      flexDirection: 'row'
    },
    locationAddress: {
      paddingVertical: 10,
      color: 'white',
      fontSize: 18,
      fontWeight: '500',
      shadowColor: "black",
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: {width: 0, height: 0},
    },
    reportButton: {
      alignItems: 'center',
      backgroundColor: "#EA2260",
      borderRadius: 10,
      padding: 16,
      marginVertical: 15,
      shadowColor: "#EA2260",
      shadowOpacity: 0.5,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
    },
    reportButtonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: '800',
    },
    reviewActions: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '65%',
      width: '100%',
      backgroundColor: 'white',
      bottom: 0,
      position: 'absolute',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 30
    },
    reviewHeader: {
      color: 'grey',
      fontSize: 15,
      fontWeight: '500'
    },
    reviewButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 25,
    },
    thumbsUpButtonBox: {
      padding: 15,
      backgroundColor: '#51FF63',
      borderRadius: 15,
      shadowColor: "black",
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: {width: 0, height: 2},
      marginHorizontal: 20
    },
    thumbsUpButton: {
      color: 'white',
      fontSize: 40,
    },
    thumbsDownButtonBox: {
      padding: 15,
      backgroundColor: '#F28C8A',
      borderRadius: 15,
      shadowColor: "black",
      shadowOpacity: 0.2,
      shadowRadius: 3,
      shadowOffset: {width: 0, height: 2},
      marginHorizontal: 20
    },
    thumbsDownButton: {
      color: 'white',
      fontSize: 40,
    },
    pastReviewsHeader: {
      color: 'grey',
      fontSize: 15,
      fontWeight: '500',
      paddingTop: 15,
      paddingLeft: 20,
      paddingBottom: 10
    },
    looksGoodButton: {
      alignItems: 'center',
      backgroundColor: "#1EB2EB",
      borderRadius: 10,
      padding: 16,
      shadowColor: "#00AEED",
      shadowOpacity: 0.5,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
    },
    looksGoodText: {
      color: 'white',
      fontSize: 20,
      fontWeight: '700',
    },
    loginPrompt: {
      paddingVertical: 20
    }
});

export default LocationModal;
