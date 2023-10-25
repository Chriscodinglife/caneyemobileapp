import LoginModal from './LoginModal';
import { Location, MachineData, Review, MachineStatus } from './Location';
import ThumbsDownModal from './thumbsDownModal';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { machineDB, auth } from '../firebaseConfig';
import { useAppContext } from './AppContextProvider';
import { ref, child, update, get } from 'firebase/database';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LocationReportListModal from './LocationReportListModal';
import { View, Text, StyleSheet, Modal, Button, Image, TouchableOpacity, ImageBackground } from 'react-native';
import ReportMachinesModal from './ReportMachinesModal';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

type LocationModalProps = {
  index: number | null;
  location: Location;
  closeLocationModal: () => void;
  selectedLocationIndex: number | null;
}

const LocationModal: React.FC<LocationModalProps> = ({ location, closeLocationModal, selectedLocationIndex, index}) => {
  
  const dbRef = ref(machineDB);
  const { user, updateUser } = useAppContext();
  const [currentLocation, setCurrentLocation] = useState(location);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [thumbsDownModalVisible, setThumbsdownModalVisible] = useState(false);
  const [locationReportListModalVisible, setLocationReportListModalVisible] = useState(false)
  const [reportMachinesModalVisible, setReportMachinesModalVisible] = useState(false);

  const goodGlassMachines = location.recentReview?.machineData?.glass.status.filter((status: MachineStatus) => status === 'thumbsUp').length ?? 0;
  const goodCanMachines = location.recentReview?.machineData?.can.status.filter((status: MachineStatus) => status === 'thumbsUp').length ?? 0;
  const goodBottleMachines = location.recentReview?.machineData?.bottle.status.filter((status: MachineStatus) => status === 'thumbsUp').length ?? 0;

  const numberGlassMachines = location.recentReview?.machineData?.glass.count ?? 0;
  const numberCanMachines = location.recentReview?.machineData?.can.count ?? 0;
  const numberBottleMachines = location.recentReview?.machineData?.bottle.count ?? 0;

  const numberOfReports = location.reviews?.length ?? 0


  const goodMachinesCount = goodGlassMachines + goodCanMachines + goodBottleMachines;
  const totalMachineCount = numberGlassMachines + numberCanMachines + numberBottleMachines;

  // Listen to state changes of the user and pass that along as needed
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      updateUser(user);
    });

  }, []);

  // Listen for changes in the location prop
  useEffect(() => {
    setCurrentLocation(location);
  }, [currentLocation]);


  return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={selectedLocationIndex === index} // Check if this marker is selected
        onRequestClose={() => closeLocationModal()}
      >
        <View style={styles.mainView}>
            <ImageBackground source={{ uri: currentLocation.imageURL}} style={styles.locationImage}>
              <View style={styles.locationMainBlackBoxHeader}>
                <View style={styles.locationHeaderBox}>
                <TouchableOpacity onPress={() => closeLocationModal()}>
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

              { numberOfReports > 0 ? ( 
                <View style={styles.recentReviewBox}>

                <Text style={styles.reviewBoxHeader}>{`🥫 ${goodMachinesCount} out of ${totalMachineCount} machines are good`}</Text>

                <View style={styles.reviewBoxGoodMachinesView}>
                  
                  <View style={styles.reviewGlassLeftColumn}>
                    <Text style={styles.reportNumber}>{goodGlassMachines}</Text>
                    <Text style={styles.reportNumberText}>Glass</Text>
                  </View>
                  
                  <View style={styles.reviewCanMiddleColumn}>
                    <Text style={styles.reportNumber}>{goodCanMachines}</Text>
                    <Text style={styles.reportNumberText}>Can</Text>
                  </View>
                  
                  <View style={styles.reviewBottleRightColumn}>
                    <Text style={styles.reportNumber}>{goodBottleMachines}</Text>
                    <Text style={styles.reportNumberText}>Bottle</Text>
                  </View>

                </View>

                <View style={styles.reportBoxFooter}>
                  <Text style={styles.reportBoxDate}>Posted on {currentLocation.recentReview?.date}</Text>
                  <TouchableOpacity style={styles.seeMoreReports} onPress={() => setLocationReportListModalVisible(true)}>
                    <Text style={styles.seeMoreReportsText}>{`See Past Reports >`}</Text>
                  </TouchableOpacity>
                </View>

              </View>

              ) : ( 
                <>
                {user ? (
                  <View style={styles.recentReviewBox}>
                    <TouchableOpacity style={styles.noReviewsContainer} onPress={() => setReportMachinesModalVisible(true)}>
                      <MaterialCommunityIcons name="alert-decagram" size={60} color="red" />
                      <Text style={styles.noReviewsText}>{`No reports have been submitted for this location.\n\nAdd one today!`}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.recentReviewBox}>
                    <TouchableOpacity style={styles.noReviewsContainer} onPress={() => setLoginModalVisible(true)}>
                      <MaterialCommunityIcons name="alert-decagram" size={60} color="red" />
                      <Text style={styles.noReviewsText}>{`No reports have been submitted for this location.\n\nLogin and add one!`}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                </>

              )}
              

              <View>
                { user ? (
                  <>
                    <View>
                      <TouchableOpacity style={styles.reportButton} onPress={() => setReportMachinesModalVisible(true)}>
                        <Text style={styles.reportButtonText}>Report Machines</Text>
                      </TouchableOpacity>
                    </View>
                    <ReportMachinesModal
                      reportMachinesModalVisible={reportMachinesModalVisible}
                      location={currentLocation}
                      setCurrentLocation={setCurrentLocation}
                      setReportMachinesModalVisible={setReportMachinesModalVisible} />
                  </>
                )
                : (
                  <>
                    <TouchableOpacity style={styles.loginPromptButton} onPress={() => setLoginModalVisible(true)}>
                      <Text style={styles.loginPromptText}>Login to add a Report</Text>
                      </TouchableOpacity>
                    <LoginModal
                      loginModalVisible={loginModalVisible}
                      setLoginModalVisible={setLoginModalVisible} />
                  </>
                )}
                <TouchableOpacity style={styles.looksGoodButton} onPress={() => closeLocationModal()}>
                  <Text style={styles.looksGoodText}>Looks Good</Text>
                </TouchableOpacity>
              </View>
            </View>

        </View>
        <LocationReportListModal 
          location={currentLocation}
          reviews={currentLocation.reviews}
          isLocationReportListModalVisible={locationReportListModalVisible}
          closeLocationReportListModal={setLocationReportListModalVisible}/>
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
      paddingBottom: 20,
    },
    locationNameSubHeader: {
      color: 'white',
      fontSize: 18,
      fontWeight: '500',
      paddingVertical: 15,
      shadowColor: "white",
      shadowOpacity: 0.2,
      shadowRadius: 4,
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
      flexDirection: 'row',
      paddingRight: 20
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
    recentReviewBox: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'white',
      alignItems: 'center',
      borderRadius: 10,
      marginBottom: 100,
      shadowColor: "black",
      shadowOpacity: 0.3,
      shadowRadius: 15,
      shadowOffset: {width: 0, height: 10},
      padding: 15
    },
    reviewBoxHeader: {
      alignSelf: 'flex-start',
      fontSize: 17,
      fontWeight: '600'
    },
    reviewBoxGoodMachinesView: {
      flex: 3,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      height: '130%',
      alignItems: 'center',
      padding: 10,
      margin: 10,
      backgroundColor: '#F6F5F1',
      borderRadius: 20
    },
    reportNumber: {
      fontWeight: 'bold',
      fontSize: 30,
    },
    reportNumberText: {
      fontSize: 17,
      fontWeight: '600'
    },
    reviewGlassLeftColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 20,
      height: '100%',
      borderRightColor: 'grey',
      borderRightWidth: 1,
      padding: 15,
    },
    reviewCanMiddleColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 20,
      height: '100%',
      borderRightColor: 'grey',
      borderRightWidth: 1,
      padding: 15
    },
    reviewBottleRightColumn: {
      flex: 1, 
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 20,
      height: '100%',
      borderRightColor: 'grey',
      padding: 15
    },
    reportBoxFooter: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      width: '100%'
    },
    reportBoxDate: {
      fontSize: 13
    },
    seeMoreReports: {
      alignSelf: 'flex-end',
      backgroundColor: '#1636EA',
      borderRadius: 5,
      padding: 4,
      paddingHorizontal: 6
    },
    seeMoreReportsText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 13
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
      color: 'black',
      fontSize: 18,
      fontWeight: '500',
      paddingBottom: 20
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
    loginPromptButton: {
      alignItems: 'center',
      backgroundColor: "#F05942",
      borderRadius: 10,
      padding: 16,
      marginVertical: 10,
      shadowColor: "#F05942",
      shadowOpacity: 0.5,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
    },
    loginPromptText: {
      color: 'white',
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center'
    },
    noReviewsContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignContent: 'center',
      alignItems: 'center'
    },
    noReviewsText: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold'
    }
});

export default LocationModal;
