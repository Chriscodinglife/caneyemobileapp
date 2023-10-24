import MapView from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { machineDB } from './firebaseConfig';
import AddButton from './components/AddButton';
import React, { useEffect, useState } from 'react';
import { ref, child, get } from 'firebase/database';
import LocationListModal from './components/LocationListModal';
import LocationMarkers from './components/LocationMarkers';
import GoogleSearchBar from './components/GoogleSearchBar';
import NewLocationModal from './components/newLocationModal';
import { AppContextProvider } from './components/AppContextProvider';
import { Location, PlaceDetailsResponse, apiKey } from './components/Location';
import { StyleSheet, Text, View, Modal, TouchableHighlight } from 'react-native';
import LocationModal from './components/LocationModal';


export default function App() {

  // Make a blank location so we can use this later
  const blankLocation: Location = {
    name: "",
    location: {
      latitude: 0,
      longitude: 0,
    },
    numMachines: 0,
    address: "",
    placeID: "",
    imageURL: "",
  }

  const dbRef = ref(machineDB);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLocationListVisible, setLocationListVisible] = useState(false);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number | null>(null);
  const [thisLocation, setThisLocation] = useState<Location>(blankLocation);
  const [locationModalVisible, setLocationModalVisible] = useState(false);


  // Get the data from the database to list out to the map
  useEffect(() => {

    // Retrieve data from Firebase and update the state
    get(child(dbRef, 'machines')).then( (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const locationsArray: Location[] = Object.values(data);

        const placeDetailsURL = `https://maps.googleapis.com/maps/api/place/details/json?photos&`
        const placePhotoURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference`

        locationsArray.forEach( async (location) => {
          // Try to get the reference for a given location photo based on its place ID
          try {
            const response = await fetch(`${placeDetailsURL}place_id=${location.placeID}&key=${apiKey}`);
            if (response.ok) {
              const data: PlaceDetailsResponse = await response.json();

              // Set the image url for the given location
              const imageURL = `${placePhotoURL}=${data.result.photos[0].photo_reference}&key=${apiKey}`
              location.imageURL = imageURL;
              setLocations(locationsArray);
            };
          } catch (error) {
            console.error("error fetching image resource", error);
          };
        });
        
      } else {
        console.log("No Data available");
      }
    }).catch( (error) => {
      console.error(error);
    });
  }, []);


  const addButtonClickHandler = () => {
    setLocationListVisible(!isLocationListVisible);
  };

  const closeListModal = () => {
    setLocationListVisible(false);
  };

  
  const openLocationModal = (location: Location, index: number) => {
    setThisLocation(location);
    setSelectedLocationIndex(index);
    setLocationModalVisible(true);
  }


  const closeLocationModal = () => {
    setThisLocation(blankLocation);
    setLocationModalVisible(false);
    setSelectedLocationIndex(null);
  }

  // Return back the MapView with the locations and a button to add
  return (
    <AppContextProvider>
      <View style={styles.mapContainer}>
        <GoogleSearchBar
          openLocationModal={openLocationModal}
        />
        <LocationModal
          selectedLocationIndex={selectedLocationIndex}
          closeLocationModal={() => closeLocationModal()}
          location={thisLocation}
          index={1}
        />
        {/* <NewLocationModal
          newLocationModalVisible={locationModalVisible}
          closeNewLocationModal={() => closeLocationModal()}
          location={thisLocation}
          locations={locations}
          setLocations={() => setLocations(previousLocations => [...previousLocations, thisLocation])}
          /> */}
        <MapView 
          provider='google' 
          style={styles.map}
          showsUserLocation={true}
          initialRegion={{
            latitude: 40.700690718242136, 
            longitude: -73.91815489689029,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1}}>
              <LocationMarkers locations={locations}/> 
        </MapView>
        <AddButton onClick={addButtonClickHandler}/>
        <LocationListModal locations={locations} closeListModal={closeListModal} isLocationListVisible={isLocationListVisible}/>
        <StatusBar style="auto" />
      </View>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  map: {
    width: '100%',
    height: '100%'
  },
});
