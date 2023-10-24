import LoginModal from './LoginModal';
import { Location } from './Location';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { machineDB, auth } from '../firebaseConfig';
import { useAppContext } from './AppContextProvider';
import { ref, child, get, set } from 'firebase/database';
import { View, Text, StyleSheet, Modal, Button, Image } from 'react-native';

type NewLocationModalProps = {
  locations: Location[];
  setLocations: () => void;
  location?: Location | null;
  newLocationModalVisible: boolean;
  closeNewLocationModal: () => void;
}

const NewLocationModal: React.FC<NewLocationModalProps> = ({ location, closeNewLocationModal, newLocationModalVisible, setLocations }) => {
  const dbRef = ref(machineDB);
  const { user, updateUser } = useAppContext();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [locationExists, setLocationExists] = useState<boolean | null>(null);
  
  
  // Use the useEffect to check that the placeID doesn't already exist in our database
  useEffect(() => {
    const checkLocationExistence = async (placeID: string) => {
      const machineRef = child(dbRef, `machines/${placeID}`);

      try {
        const snapshot = await get(machineRef);
        return snapshot.exists();
      } catch (error) {
        console.error('Error checking location existence:', error);
        return false; // Return false in case of an error
      }
    };

    if (location?.placeID) {
      checkLocationExistence(location.placeID).then((exists) => {
        setLocationExists(exists);
      });
    }
  }, [location]);

  // Listen to state changes of the user and pass that along as needed
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      updateUser(user);
    });

  }, []);

  // Create a function to add a location to the database
  const addLocationToDatabase = (location: Location | null | undefined) => {
    const locationRef = child(dbRef, `machines/${location?.placeID}`);
    set(locationRef, location)
      .then(() => {
        // Location added successfully
        console.log('Location added to the database:', location);
        setLocations()

      })
      .catch((error) => {
        console.error('Error adding location to the database:', error);
        alert("There was an issue adding to the database:" + error.message)
      });
  };

  // Only show the add to database button if the location does not exist
  const renderAddLocationFeature = () => {
    if (locationExists === null) {
      return null; // Loading state
    }

    if (!locationExists) {
      return (<>
        { user ? (
          <Button
          title="Add this place to the database"
          onPress={() => {
            addLocationToDatabase(location);
            closeNewLocationModal();}}
        />
        )
        : ( <>
          <Button
            title="Login first to add this to the map"
            onPress={() => {
              setLoginModalVisible(true)
            }} />
          <LoginModal
            loginModalVisible={loginModalVisible}
            setLoginModalVisible={() => setLoginModalVisible(false)} />
            </>
        )}
        
        </>
      );
    }

    return null; // Location exists, no need to render the button
  };

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={newLocationModalVisible} // Check if this marker is selected
      onRequestClose={() => closeNewLocationModal()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text
            style={styles.locationName}>
            {location?.name}
          </Text>
          <Text
            style={styles.machines}>
            Machines Available: {location?.numMachines}
          </Text>
          <Image
            style={styles.locationImage}
            source={{ uri: location?.imageURL }} />
          {renderAddLocationFeature()}
          <Button
            title="Close"
            onPress={() => closeNewLocationModal()}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  locationName: {
    fontSize: 20,
    paddingBottom: 15
  },
  machines: {
    fontWeight: "200",
    fontSize: 15
  },
  locationImage: {
    width: "40%",
    height: "40%"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    marginTop: 200,
    padding: 30,
    paddingTop: 40,
    paddingBottom: 300,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%'
  },
});


export default NewLocationModal;
