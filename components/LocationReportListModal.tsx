import { Review, MachineStatus, Location } from './Location';
import React, { useState, Dispatch, SetStateAction } from 'react';

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Button, Modal} from 'react-native';

type LocationReportListModalProps = {
    location: Location;
    reviews?: Review[];
    isLocationReportListModalVisible: boolean;
    closeLocationReportListModal: Dispatch<SetStateAction<boolean>>;
}



const LocationReportListModal: React.FC<LocationReportListModalProps> = ({ reviews, closeLocationReportListModal, isLocationReportListModalVisible, location }) => {
  return (
    <Modal
      animationType='slide'
      transparent={false}
      visible={isLocationReportListModalVisible}
      onRequestClose={() => closeLocationReportListModal(false)}>
      <View style={styles.reportsMainView}>
        
        <View style={styles.headerBox}>
          <Text style={styles.mainHeader}>
            Past Reports for {location.name}
          </Text>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollViewContentStyle} style={styles.scrollView}>
          { reviews?.map( (review, index) => { 
            
            const goodGlassMachines = review.machineData?.glass?.status?.filter((status: MachineStatus) => status === 'thumbsUp').length ?? 0;
            const goodCanMachines = review.machineData?.can?.status?.filter((status: MachineStatus) => status === 'thumbsUp').length ?? 0;
            const goodBottleMachines = review.machineData?.bottle?.status?.filter((status: MachineStatus) => status === 'thumbsUp').length ?? 0;
          
            const numberGlassMachines = review.machineData?.glass.count ?? 0;
            const numberCanMachines = review.machineData?.can.count ?? 0;
            const numberBottleMachines = review.machineData?.bottle.count ?? 0;
          
          
            const goodMachinesCount = goodGlassMachines + goodCanMachines + goodBottleMachines;
            const totalMachineCount = numberGlassMachines + numberCanMachines + numberBottleMachines;
            
            return ( 
              <View style={styles.recentReviewBox} key={index}>
                
                <View style={styles.reportBoxFooter}>
                  <Text style={styles.reportBoxDate}>Posted on {review.date}</Text>
                </View>

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

                

              </View>
            )
          })}
        </ScrollView>

        <TouchableOpacity style={styles.closeButton} onPress={() => closeLocationReportListModal(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>

      </View>
    </Modal>
  )
};

const styles = StyleSheet.create({
  reportsMainView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#1648FA",
    padding: 30,
    justifyContent: 'space-between',
  },
    headerBox: {
        alignItems: 'flex-start',
        paddingTop: 60
    },
    mainHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    scrollView: {
      marginVertical: 30,
    },
    scrollViewContentStyle: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 30,
      paddingVertical: 20
    },
    recentReviewBox: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'white',
      alignItems: 'center',
      borderRadius: 10,
      padding: 20,
      shadowColor: "black",
      shadowOpacity: 0.3,
      shadowRadius: 15,
      shadowOffset: {width: 0, height: 10},
    },
    reviewBoxHeader: {
      alignSelf: 'flex-start',
      fontSize: 17,
      fontWeight: '600'
    },
    reviewBoxGoodMachinesView: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
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
      gap: 30,
      height: '100%',
      borderRightColor: 'grey',
      borderRightWidth: 1,
      padding: 20,
    },
    reviewCanMiddleColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 30,
      height: '100%',
      borderRightColor: 'grey',
      borderRightWidth: 1,
      padding: 20
    },
    reviewBottleRightColumn: {
      flex: 1, 
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 30,
      height: '100%',
      borderRightColor: 'grey',
      padding: 20
    },
    reportBoxFooter: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      width: '100%',
      paddingBottom: 5
    },
    reportBoxDate: {
      fontSize: 16
    },
    closeButton: {
      backgroundColor: 'white',
      padding: 16,
      alignItems: 'center',
      borderRadius: 10
    },
    closeButtonText: {
      color: 'black',
      fontSize: 20,
      fontWeight: '700'
    }
  });

export default LocationReportListModal