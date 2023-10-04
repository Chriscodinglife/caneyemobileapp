import React, { useState } from 'react';
import LocationModal from './LocationModal';
import { useAppContext } from './AppContextProvider';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TouchableHighlight, Modal } from 'react-native';


type LocationListModalProps = {
  locations: Location[];
  closeListModal: () => void;
  isLocationListVisible: boolean;
};

const LocationListModal: React.FC<LocationListModalProps> = ({ locations, closeListModal, isLocationListVisible }) => {
  const { user, updateUser } = useAppContext();
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number | null>(null);


  const openMarkerModal = (index: number) => {
    setSelectedLocationIndex(index);
  }


  const closeMarkerModal = () => {
    setSelectedLocationIndex(null);
  }

  
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={isLocationListVisible}
      onRequestClose={() => closeListModal()}>
      <View style={styles.locationListModalContainer}>
        <View style={styles.locationListModalContent}>
            <TouchableOpacity onPress={() => closeListModal()}>
                <Text style={styles.closeButtonText}>{`<-`}</Text>
            </TouchableOpacity>
          <Text style={styles.locationListSubHeader}>What's in your area</Text>
          <Text style={styles.locationListHeader}>Local Recycle Machines</Text>
          <ScrollView>
            { locations.map( (location, index) => { 
              return (
                <TouchableOpacity key={index} style={styles.listItem} onPress={() => openMarkerModal(index)}>
                  <Image style={styles.locationImage} source={{uri: location.imageURL}}/>
                  <View style={styles.locationDetails}>
                    <Text style={styles.locationName}>{location.name}</Text>
                    <Text style={styles.locationAddress}>{location.address}</Text>
                  </View>
                  <LocationModal 
                    selectedLocationIndex={selectedLocationIndex}
                    closeMarkerModal={() => closeMarkerModal()}
                    location={location}
                    index={index}/>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  locationListModalContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  closeButtonText: {
    color: 'grey',
    fontWeight: "bold",
    fontSize: 20,
    backgroundColor: 'white'
  },
  locationListModalContent: {
    backgroundColor: 'white',
    marginTop: 30,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%'
  },
  locationListSubHeader: {
    paddingTop: 30,
    color: 'grey',
    fontSize: 10
  },
  locationListHeader: {
    paddingBottom: 30,
    fontWeight: '600',
    fontSize: 20,
    color: '#636661'
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    padding: 1,
    margin: 1,
    height: 150,
  },
  locationImage: {
    height: '50%',
    width: '50%',
    borderRadius: 15
  },
  locationDetails: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 20,
    paddingTop: 15,
    alignContent: 'center',
  },
  locationName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  locationAddress: {
    fontSize: 10,
    paddingTop: 5,
    color: 'grey'
  }
});

export default LocationListModal;
