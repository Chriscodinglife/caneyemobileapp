import { Location } from './Location';
import React, { useState, Dispatch, SetStateAction } from 'react';
import LocationModal from './LocationModal';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet, Modal, Button, Image } from 'react-native';
import { setLogLevel } from 'firebase/app';
import { update } from 'firebase/database';

interface LocationMarkersProps {
  locations: { [placeID: string]: Location } | undefined;
  setLocations: Dispatch<SetStateAction<{[placeID: string] : Location}>>;
};

const LocationMarkers: React.FC<LocationMarkersProps> = (props: LocationMarkersProps) => {
  const [selectedPlaceID, setSelectedPlaceID] = useState<string | null>(null);
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);


  const openLocationModal = (placeID: string) => {
    setSelectedPlaceID(placeID);
  };


  const closeLocationModal = () => {
    setSelectedPlaceID(null);
  };

  const updateLocationAtThisPlaceID = (location: Location, placeID: string | null) => {
    props.setLocations((prevLocations) => ({...prevLocations, [placeID as string]: location}));

  };

  const renderMarkersAndLocationModals = () => {
    for (const placeID in props.locations) {
      const location = props.locations[placeID];
      return (
        <View key={placeID}>
          <Marker
            coordinate={location.location}
            style={styles.marker}
            title={location.name}
            onPress={() => setLocationModalVisible(true)}/>
          <LocationModal 
            placeID={placeID}
            location={location}
            isLocationModalVisible={isLocationModalVisible}
            setLocationModalVisible={setLocationModalVisible}
            updateLocationAtThisPlaceID={updateLocationAtThisPlaceID}
            />
        </View>
      )
    }
  };

  return (
    <>
    {renderMarkersAndLocationModals()}
    </>
  )

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
