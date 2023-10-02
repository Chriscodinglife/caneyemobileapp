import LoginModal from './LoginModal';
import { Location, Review } from './Location';
import ThumbsDownModal from './thumbsDownModal';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { machineDB, auth } from '../firebaseConfig';
import { useAppContext } from './AppContextProvider';
import LocationReviewList from './LocationReviewList';
import { ref, child, update, get } from 'firebase/database';
import { View, Text, StyleSheet, Modal, Button, Image } from 'react-native';

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
        transparent={true}
        visible={selectedLocationIndex === index} // Check if this marker is selected
        onRequestClose={() => closeMarkerModal()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={styles.locationName}>
              {location.name}
            </Text>
            <Text
              style={styles.machines}>
              Machines Available: {location.numMachines}
            </Text>
            <Image
              style={styles.locationImage}
              source={{ uri: location.imageURL }} />
            { user ? (
              <>
                <Text>
                  Would you like to report an issue?
                </Text>
                <Button title='Thumbs Up' onPress={() => handleThumbsUp()}/>
                <Button title='Thumbs Down' onPress={() => handleThumbsDown()}/>
                <ThumbsDownModal 
                  thumbsDownModalVisible={thumbsDownModalVisible} 
                  location={location}
                  setCurrentLocation={setCurrentLocation} 
                  setThumbsdownModalVisible={setThumbsdownModalVisible}/>
              </>
            )
            : (
              <>
                <Button title="Login first to add this to the map" onPress={() => {setLoginModalVisible(true)}} />
                <LoginModal
                  loginModalVisible={loginModalVisible}
                  setLoginModalVisible={() => setLoginModalVisible(false)} />
              </>
            )}
            <Button title="Close" onPress={() => closeMarkerModal()} />
            <LocationReviewList reviews={currentLocation.reviews}/>
          </View>
        </View>
      </Modal>
  )
}

const styles = StyleSheet.create({
    marker: {},
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end'
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 30,
      paddingTop: 40,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: '75%'
    },
    locationName: {
      fontSize: 20,
      paddingBottom: 10
    },
    machines: {
      fontWeight: "200",
      fontSize: 15
    },
    locationImage: {
      width: "40%",
      height: "20%"
    }
});

export default LocationModal;
