import React, { useState } from 'react';
import LocationModal from './LocationModal';
import { Location, MachineStatus } from './Location';
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


  const openLocationModal = (index: number) => {
    setSelectedLocationIndex(index);
  }


  const closeLocationModal = () => {
    setSelectedLocationIndex(null);
  }

  
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={isLocationListVisible}
      onRequestClose={() => closeListModal()}>

      <View style={styles.mainView}>

          <View style={styles.headerBox}>
            <TouchableOpacity onPress={() => closeListModal()}>
                <Text style={styles.closeButtonText}>{`<-`}</Text>
            </TouchableOpacity>
            
            <Text style={styles.mainHeader}>Local Recycle Machines</Text>
            <Text style={styles.subMainHeader}>What's in your area</Text>
          </View>

          <View style={styles.scrollLocations}>
            <ScrollView>
              { locations.map( (location, index) => { 

                const goodGlassMachines = location.recentReview?.machineData?.glass.status.filter((status: MachineStatus) => status === 'thumbsUp').length ?? 0;
                const goodCanMachines = location.recentReview?.machineData?.can.status.filter((status: MachineStatus) => status === 'thumbsUp').length ?? 0;
                const goodBottleMachines = location.recentReview?.machineData?.bottle.status.filter((status: MachineStatus) => status === 'thumbsUp').length ?? 0;

                const numberGlassMachines = location.recentReview?.machineData?.glass.count ?? 0;
                const numberCanMachines = location.recentReview?.machineData?.can.count ?? 0;
                const numberBottleMachines = location.recentReview?.machineData?.bottle.count ?? 0;


                const goodMachinesCount = goodGlassMachines + goodCanMachines + goodBottleMachines;
                const totalMachineCount = numberGlassMachines + numberCanMachines + numberBottleMachines;
                return (
                  <View key={index} style={styles.locationItem}>
                    <TouchableOpacity style={styles.locationContent} onPress={() => openLocationModal(index)}>
                      <Image style={styles.locationImage} source={{uri: location.imageURL}}/>
                      <View style={styles.locationDetails}>
                        <Text style={styles.locationName}>{location.name}</Text>
                        <Text style={styles.locationAddress}>{location.address}</Text>
                        <Text style={styles.locationStatus}>{`🥫 ${goodMachinesCount}`} machines</Text>
                      </View>
                      <LocationModal 
                        selectedLocationIndex={selectedLocationIndex}
                        closeLocationModal={() => closeLocationModal()}
                        location={location}
                        index={index}/>
                    </TouchableOpacity>
                  </View>
                )
              })}
              <TouchableOpacity style={styles.searchNewButton}onPress={() => closeListModal()}>
                <Text style={styles.searchNewText}>{`Don't see a location?\nSearch for one and add it!`}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View>
            <TouchableOpacity style={styles.closeButton} onPress={() => closeListModal()}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 30
  },
  headerBox: {
    alignItems: 'flex-start',
    paddingTop: 20,
  },
  mainHeader: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subMainHeader: {
    fontSize: 18,
    fontWeight: '500',
  },
  closeButtonText: {
    color: 'grey',
    fontWeight: "bold",
    fontSize: 20,
    backgroundColor: 'white',
    paddingVertical: 30
  },
  scrollLocations: {
    flex: 1,
    backgroundColor: "#faf0e64D",
    padding: 10,
    marginVertical: 10
  },
  locationItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,
    padding: 10,
    gap: 40,
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 10, width: 0},
    
  },
  locationContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
    height: '100%',
    padding: 8,
  },
  locationImage: {
    alignSelf: 'center',
    height: '100%',
    width: '50%',
    borderRadius: 5
  },
  locationDetails: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 20,
    alignItems: 'flex-end',
    padding: 10
  },
  locationName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  locationAddress: {
    fontSize: 14,
    textAlign: 'right',
  },
  locationStatus: {
    fontSize: 18,
    fontWeight: '700'
  },
  searchNewButton: {
    marginVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#EA8402",
    borderRadius: 10,
    padding: 14,
    shadowColor: "#00AEED",
  },
  searchNewText: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: "#1EB2EB",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#00AEED",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  closeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default LocationListModal;
