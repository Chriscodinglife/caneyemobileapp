import { Location } from './Location';
import React, { useState, Dispatch, SetStateAction } from 'react';
import LocationModal from './LocationModal';
import { Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

interface LocationMarkersProps {
  locations: { [placeID: string]: Location } | undefined;
  setLocations: Dispatch<SetStateAction<{[placeID: string] : Location}>>;
};

const LocationMarkers: React.FC<LocationMarkersProps> = (props: LocationMarkersProps) => {

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

  const [selectedLocation, setSelectedLocation] = useState<Location>(blankLocation);
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);

  const updateLocationAtThisPlaceID = (location: Location, placeID: string | null) => {
    props.setLocations((prevLocations) => ({...prevLocations, [placeID as string]: location}));

  };

  const handleSelectedLocation = (location: Location) => {
    // Handle the selected Marker by setting the Location selected and making the modal visible
    setSelectedLocation(location);
    setLocationModalVisible(true);
  };

  const renderMarkers = () => {
    // Render all the locations in the database
    const markerModals = [];

    for (let placeID in props.locations) {
      let location = props.locations[placeID];
      markerModals.push(
        <View key={placeID}>
          <Marker
            coordinate={location.location}
            style={styles.marker}
            title={location.name}
            onPress={() => handleSelectedLocation(location)}/>
            <LocationModal 
            placeID={selectedLocation.placeID}
            location={selectedLocation}
            isLocationModalVisible={isLocationModalVisible}
            setLocationModalVisible={setLocationModalVisible}
            updateLocationAtThisPlaceID={updateLocationAtThisPlaceID} 
            setSelectedLocation={setSelectedLocation}/>
            
        </View>
      );
    };

    return markerModals;
  };

  return (
    <>
    {renderMarkers()}
    
    </>
  );

};

const styles = StyleSheet.create({
  marker: {},
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
  }
})

export default LocationMarkers;
